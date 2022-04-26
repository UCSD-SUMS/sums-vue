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
      />
    </div>
    <div>
      <button class="m-2 btn btn-info" v-on:click="update">Get Status</button>
      <a class="m-2 btn btn-primary" href="https://forms.gle/A1n3Bi3x1rN3pCHc7">
        Submit Application
      </a>
    </div>
    <div v-if="clicked && loading" class="m-2 spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <p v-if="clicked && !loading">
      You have attended
      <span class="badge badge-pill badge-secondary">
        {{ attendance.events }}
      </span>
      events and
      <span class="badge badge-pill badge-secondary">
        {{ attendance.meetings }}
      </span>
      meetings in the last 90 days.
    </p>
  </div>
</template>

<script>
import fetch from "node-fetch";
export default {
  data: () => ({
    email: "",
    attendance: {
      events: 0,
      meetings: 0,
    },
    loading: false,
    clicked: false,
  }),
  methods: {
    update: async function (event) {
      this.clicked = true;
      this.loading = true;
      const res = await fetch(
        `https://www.joinsums.org/attendance/${this.email}`
      );
      this.attendance = await res.json();
      this.loading = false;
    },
  },
};
</script>
