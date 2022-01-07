<template>
  <div class="m-2 p-2 border rounded text-center">
    <h3>Do You Satisfy Membership Requirements?</h3>
    <div class="form-group">
      <label>Email Address</label>
      <input
        class="form-control"
        type="email"
        placeholder="john@example.com"
        v-model="email"
        v-on:keyup.enter="update"
      />
    </div>
    <button class="mb-2 btn btn-primary" v-on:click="update">Get Status</button>
    <p>
      You have attended {{ en }} events and {{ mn }} meetings in the last 120
      days.
    </p>
  </div>
</template>

<script>
import fetch from "node-fetch";
export default {
  data: () => ({
    email: "",
    en: 0,
    mn: 0,
  }),
  methods: {
    update: async function (event) {
      const d = await (
        await fetch("https://www.joinsums.org/attendance-hash.json")
      ).json();
      const kE = dcodeIO.bcrypt.hashSync(this.email, d.saltE);
      const kM = dcodeIO.bcrypt.hashSync(this.email, d.saltM);
      this.en = d.events[kE] || 0;
      this.mn = d.meetings[kM] || 0;
    },
  },
};
</script>
