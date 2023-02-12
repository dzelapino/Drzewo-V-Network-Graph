<template>
  <div class="ViewWrapper">
    <div class="TreePageWrapper">
      <div class="PageMessage">
        {{ message }}
      </div>
      <div class="FoundSomeone" v-if="foundSomeone">
        <div class="ChosenToMerge">
          Person chosen to merge: {{ personChosen }}
        </div>
        <div class="FoundList">
          <div class="FoundPerson" v-for="person in foundPeople" :key="person">
            <button class="FoundButton" @click="pickPerson" :value="person">
              Choose {{ person }}
            </button>
          </div>
        </div>
        <div class="FoundMenu">
          <button @click="inspectTree">Inspect tree</button>
          <button @click="exitFound">Exit view</button>
          <button @click="mergeTrees">Merge</button>
        </div>
      </div>
      <div class="FamilyWrapper">
        <v-network-graph
          :nodes="nodes"
          :edges="edges"
          :configs="configs"
          :event-handlers="eventHandlers"
        >
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label
              :text="edge.label"
              align="center"
              vertical-align="above"
              v-bind="slotProps"
            />
          </template>

          <template #override-node="slotProps">
            <v-shape
              v-bind="slotProps"
              @mousedown="customEventHandler(slotProps.nodeId, $event)"
              @mouseup="customEventHandler(slotProps.nodeId, $event)"
              @mouseover="customEventHandler(slotProps.nodeId, $event)"
            />
          </template>
        </v-network-graph>
      </div>
    </div>
    <div class="TreeButtons" v-if="!foundSomeone">
      <button
        class="TreeButton"
        @click="setToggle('add')"
        :disabled="toggle == 'add'"
      >
        Add relative
      </button>
      <button
        class="TreeButton"
        @click="setToggle('data')"
        :disabled="toggle == 'data'"
      >
        Show data
      </button>
      <button
        class="TreeButton"
        @click="setToggle('hide')"
        :disabled="toggle == 'hide'"
      >
        Hide
      </button>
      <button class="TreeButton" @click="incRelatives">Increase</button>
      <button class="TreeButton" @click="resetRelatives">
        Generations: {{ relativesUpTo }}
      </button>
      <button
        class="TreeButton"
        @click="decRelatives"
        :disabled="relativesUpTo == 0"
      >
        Decrease
      </button>
      <button
        class="TreeButton"
        @click="setToggle('update')"
        :disabled="toggle == 'update'"
      >
        Update
      </button>
      <button class="TreeButton" @click="reloadTree">Reload</button>
      <button
        class="TreeButton"
        @click="deleteRelative"
        :disabled="this.myId == this.initId"
      >
        Delete
      </button>
    </div>
    <div class="CreateRelative" v-if="toggle == 'add'">
      <div class="RelativeForm" v-if="$store.state.authorized">
        <div class="RadioButtons">
          <div class="TypeRadio">
            <input
              class="RadioButton"
              type="radio"
              name="type"
              value="parent"
              v-model="type"
            />
            <div class="RadioText">Parent</div>
          </div>
          <div class="TypeRadio">
            <input
              class="RadioButton"
              type="radio"
              name="type"
              value="child"
              v-model="type"
            />
            <div class="RadioText">Child</div>
          </div>
        </div>
        <label for="sure">Are you certain that he is your relative?</label>
        <div class="RadioButtons">
          <div class="TypeRadio">
            <input
              class="RadioButton"
              type="radio"
              name="sure"
              value="true"
              v-model="sure"
            />
            <div class="RadioText">Yes</div>
          </div>
          <div class="TypeRadio">
            <input
              class="RadioButton"
              type="radio"
              name="sure"
              value="false"
              v-model="sure"
            />
            <div class="RadioText">No</div>
          </div>
        </div>
        <label for="name">Name</label>
        <input id="name" type="text" v-model="name" />
        <label for="surname">Surname</label>
        <input id="surname" type="text" v-model="surname" />
        <label for="gender">Gender</label>
        <div class="RadioButtons">
          <div class="GenderRadio">
            <input
              class="RadioButton"
              type="radio"
              name="gender"
              value="male"
              v-model="gender"
            />
            <div class="RadioText">Male</div>
          </div>
          <div class="GenderRadio">
            <input
              class="RadioButton"
              type="radio"
              name="gender"
              value="female"
              v-model="gender"
            />
            <div class="RadioText">Female</div>
          </div>
        </div>
        <label for="birthDate">Birth date:</label>
        <input
          type="date"
          name="birth-date"
          min="1700-01-01"
          max="2023-12-31"
          v-model="birthDate"
        />
        <button
          :disabled="!name && !surname"
          class="RegisterButton"
          @click="createRelative"
        >
          Create relative
        </button>
      </div>
    </div>
    <div class="UpdateRelative" v-if="toggle == 'update'">
      <div class="RelativeForm" v-if="$store.state.authorized">
        <label for="sure">Are you certain that he is your relative?</label>
        <div class="RadioButtons">
          <div class="TypeRadio">
            <input
              class="RadioButton"
              type="radio"
              name="updateSure"
              value="true"
              v-model="updateSure"
            />
            <div class="RadioText">Yes</div>
          </div>
          <div class="TypeRadio">
            <input
              class="RadioButton"
              type="radio"
              name="updateSure"
              value="false"
              v-model="updateSure"
            />
            <div class="RadioText">No</div>
          </div>
        </div>
        <label for="name">Name</label>
        <input id="name" type="text" v-model="updateName" />
        <label for="surname">Surname</label>
        <input id="surname" type="text" v-model="updateSurname" />
        <!-- <label for="birthDate">Birth date:</label>
        <input
          type="date"
          name="birth-date"
          min="1700-01-01"
          max="2023-12-31"
          v-model="updateBirthDate"
        /> -->
        <button
          :disabled="!updateName && !updateSurname"
          class="UpdateButton"
          @click="updateRelative"
        >
          Update
        </button>
      </div>
    </div>
    <div class="UserDataWrapper" v-else-if="toggle == 'data'">
      <div class="UserData">
        <div class="UserContent">Name: {{ userData.name }}</div>
        <div class="UserContent">Surname: {{ userData.surname }}</div>
        <div class="UserContent">Gender:{{ userData.gender }}</div>
        <div class="UserContent">Relative:{{ userData.sure }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as vNG from "v-network-graph";
import { ForceLayout } from "v-network-graph/lib/force-layout";
import { VShape } from "v-network-graph";

function customEventHandler(nodeId, event) {
  const eventInfo = {
    idIndex: parseInt(nodeId),
    type: event.type,
    x: event.clientX,
    y: event.clientY,
  };
  if (event.type == "click") {
    heightDist.value = event.clientY;
    widthDist.value = event.clientX;
    manageNode.value = "none"
      ? (manageNode.value = "flex")
      : (manageNode.value = "none");
  }
}

export default {
  name: "TreeView",
  data() {
    return {
      name: "",
      surname: "",
      birthDate: "",
      gender: "male",
      type: "parent",
      sure: true,
      myId: this.$store.state.neoId,
      initId: this.$store.state.neoId,
      relativesUpTo: 5,
      message: "",
      nodes: {},
      edges: {},
      toggle: "hide",
      userData: {},
      updateName: "",
      updateSurname: "",
      updateBirthDate: "",
      updateSure: true,
      foundPeople: [1, 2],
      foundSomeone: false,
      personChosen: null,
      createdPersonId: null,
      configs: vNG.defineConfigs({
        view: {
          layoutHandler: new ForceLayout({
            positionFixedByDrag: true,
            positionFixedByClickWithAltKey: true,
          }),
        },
        node: {
          selectable: true,
          normal: { radius: 30 },
          label: { direction: "center", color: "#000", fontSize: 18 },
          hover: {
            type: "circle",
            radius: 34,
            // for type is "rect" -->
            width: 32,
            height: 32,
            borderRadius: 4,
            // <-- for type is "rect"
            strokeWidth: 0,
            strokeColor: "#000000",
            strokeDasharray: "0",
            color: "#dd2288",
          },
          selected: {
            type: "circle",
            radius: 35,
            // for type is "rect" -->
            width: 32,
            height: 32,
            borderRadius: 4,
            // <-- for type is "rect"
            strokeWidth: 0,
            strokeColor: "#000000",
            strokeDasharray: "0",
            color: "#4466cc",
          },
        },
        edge: {
          normal: {
            color: "#aaa",
            width: 3,
          },
          margin: 4,
          marker: {
            target: {
              type: "arrow",
              width: 4,
              height: 4,
            },
          },
        },
      }),
      eventHandlers: {
        "node:click": ({ node }) => {
          this.myId = Number(node.replace("node", ""));
        },
        "node:contextmenu": ({ node, event }) => {
          customEventHandler(node, event);
          console.log(node);
        },
      },
    };
  },
  created() {
    this.$axios
      .get(`/people/family/${this.$store.state.neoId}/${this.relativesUpTo}`)
      .then((response) => {
        // this.family = response.data.message.msgBody;
        this.nodes = response.data.message.msgBody.nodes;
        this.edges = response.data.message.msgBody.edges;
        this.userData = this.nodes["node" + `${this.myId}`];
        this.updateName = this.nodes["node" + `${this.myId}`].name;
        this.updateSurname = this.nodes["node" + `${this.myId}`].surname;
        this.updateBirthDate = this.nodes["node" + `${this.myId}`].birthDate;
        this.updateSure = this.nodes["node" + `${this.myId}`].sure;
        console.log(response);
      });
  },
  watch: {
    myId() {
      this.userData = this.nodes["node" + `${this.myId}`];
      this.updateName = this.nodes["node" + `${this.myId}`].name;
      this.updateSurname = this.nodes["node" + `${this.myId}`].surname;
      this.updateBirthDate = this.nodes["node" + `${this.myId}`].birthDate;
      this.updateSure = this.nodes["node" + `${this.myId}`].sure;
    },
    foundPeople() {
      if (this.foundPeople.length > 0) {
        this.foundSomeone = true;
        this.toggle = "hide";
        this.personChosen = this.foundPeople[0];
      }
    },
  },
  methods: {
    getUsers() {
      this.$axios.get(`/users`).then((response) => {
        console.log(response);
      });
    },
    setMyId() {
      this.myId = this.$store.state.neoId;
    },
    setToggle(value) {
      this.toggle = value;
    },
    customEventHandler(nodeId, event) {
      const eventInfo = {
        nodeId: nodeId,
        type: event.type,
        x: event.clientX,
        y: event.clientY,
      };
      // & WAZNE
      // console.log(eventInfo);
    },
    async reloadTree() {
      try {
        await this.$axios
          .get(`/people/family/${this.myId}/${this.relativesUpTo}`)
          .then((response) => {
            this.nodes = response.data.message.msgBody.nodes;
            this.edges = response.data.message.msgBody.edges;
            console.log(response);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async deleteRelative() {
      if (this.myId == this.initId) {
        this.message = "You can't delete yourself from the graph.";
      } else {
        try {
          const deleteRes = await this.$axios
            .delete(`/people/deleteRelative/${this.myId}`)
            .then((deleteRes) => deleteRes.data);
          this.message = deleteRes.message.msgBody;
          this.myId = this.initId;
          await this.reloadTree();
        } catch (error) {
          console.log(error);
        }
      }
    },
    incRelatives() {
      this.relativesUpTo = this.relativesUpTo + 1;
    },
    decRelatives() {
      this.relativesUpTo = this.relativesUpTo - 1;
    },
    resetRelatives() {
      this.relativesUpTo = 5;
    },
    async createRelative() {
      const personToCreate = {
        name: this.name,
        surname: this.surname,
        birthDate: this.birthDate,
        gender: this.gender,
        sure: this.sure,
      };
      try {
        const resNeo = await this.$axios
          .post("/people/createPerson", personToCreate)
          .then((resNeo) => resNeo.data);
        this.foundPeople = resNeo.message.msgFoundPeople;
        this.createdPersonId = resNeo.message.msgPayload;
        const relative = {
          type: this.type,
          myId: this.myId,
          relatedId: resNeo.message.msgPayload,
        };

        const resRelative = await this.$axios
          .post("/people/createRelative", relative)
          .then((resRelative) => resRelative.data);
        console.log(resRelative);
        this.message = resRelative.message.msgBody;
        await this.reloadTree();
      } catch (error) {
        console.log(error);
      }
    },
    async updateRelative() {
      const personToUpdate = {
        name: this.updateName,
        surname: this.updateSurname,
        // birthDate: this.updateBirthDate,
        sure: this.updateSure,
      };
      try {
        const resNeo = await this.$axios
          .put(`/people/update/${this.myId}`, personToUpdate)
          .then((resNeo) => resNeo.data);
        this.message = resNeo.message.msgBody;
        await this.reloadTree();
      } catch (error) {
        console.log(error);
      }
    },
    pickPerson: function (e) {
      this.personChosen = e.target.value;
    },
    async inspectTree() {
      try {
        await this.$axios
          .get(`/people/family/${this.personChosen}/${this.relativesUpTo}`)
          .then((response) => {
            this.nodes = response.data.message.msgBody.nodes;
            this.edges = response.data.message.msgBody.edges;
            console.log(response);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async exitFound() {
      this.myId = this.initId;
      this.foundPeople = [];
      this.foundSomeone = false;
      await this.reloadTree();
    },
    async mergeTrees() {
      if (this.personChosen && this.createdPersonId) {
        try {
          await this.$axios
            .post(
              `/people/treeCopy/${this.personChosen}/${this.createdPersonId}`
            )
            .then((response) => {
              console.log(response);
              console.log("Copy success");
            });
          this.foundSomeone = false;
          await this.reloadTree();
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Create and pick someone in order to merge");
      }
    },
  },
};
</script>

<style scoped>
.ViewWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 25px;
}
.CreateRelative,
.UpdateRelative,
.UserDataWrapper {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.RelativeForm,
.UserData {
  background: lightsteelblue;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 1px 1px 12px 1px black;
  font-size: larger;
  font-weight: bold;
  border-radius: 2.5%;
  gap: 15px;
  padding: 30px;
  color: black;
}
.TreePageWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
  justify-content: center;
}
.FamilyWrapper {
  margin-top: 10px;
  height: 700px;
  width: 100%;
  background: lightcyan;
  box-shadow: 1px 1px 6px 1px black;
  border-radius: 1.5%;
}
.TreeButtons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
  margin-bottom: 15px;
}
label {
  width: 80%;
  font-size: larger;
  color: black;
}
input {
  background: lightcyan;
  font-size: larger;
  color: black;
  border: 5px solid lightcyan;
  border-radius: 5%;
  background: lightcyan;
  width: 50%;
  box-shadow: 1px 1px 12px 1px black;
}
input:focus {
  outline: none;
}
button {
  font-size: larger;
  width: 30%;
  color: black;
  border: 5px solid lightcyan;
  border-radius: 5%;
  background: lightcyan;
  box-shadow: 1px 1px 12px 1px black;
}
button:hover {
  cursor: pointer;
  box-shadow: 1px 1px 12px 5px white;
}
.RadioButtons {
  display: flex;
  align-items: center;
  gap: 35px;
}
.RadioButton {
  transform: scale(3);
  box-shadow: none;
}
.RadioButton:checked {
  accent-color: darkviolet;
}
.RadioText {
  padding-top: 15px;
}
.PageMessage {
  margin-top: 20px;
  color: black;
  font-size: larger;
  font-weight: bold;
}
.FoundSomeone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 80%;
}
.FoundMenu {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
}
.FoundList {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
}
.ChosenToMerge {
  font-weight: bolder;
  font-size: larger;
  font-size: larger;
  width: 30%;
  color: black;
  border: 5px solid lightcyan;
  border-radius: 5%;
  background: lightcyan;
  box-shadow: 1px 1px 12px 1px black;
}
.FoundPerson {
  width: 15%;
  /* background: red; */
}
.FoundButton {
  width: 100%;
}
</style>