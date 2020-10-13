<!-- Reusable Component for Rendering Officer Bios -->

<template>
  <!-- Bootstrap Row -->
  <div class="row pt-4">
    <!-- Bootstrap Column -->
    <div class="col-md-4">
      <img v-bind:src="'./officer-pics/' + image" class="card-img" />
    </div>

    <!-- Bootstrap Column -->
    <div class="col-md-8 pt-4">
      <!-- Use `slot` element so VuePress headers are built correctly. -->
      <slot name="title"></slot>

      <!-- Fill in with the information passed to the component. -->
      <strong>{{ name }}</strong> <br />
      <a v-bind:href="'mailto:' + email">{{ email }}</a> <br />
      <em>{{ major }}</em> <br />
      <em>{{ year }}</em>

      <!-- Using a `slot` here makes it easier to read the markdown file. -->
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["name", "image", "email", "major", "year"],
};
</script>
