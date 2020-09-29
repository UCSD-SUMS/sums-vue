const { env } = require("process");
const { description } = require("../../package.json");

module.exports = {
  base: env.VUE_BASE !== undefined ? env.VUE_BASE : "/",

  title: "SUMS",
  description,

  port: 8000,
  dest: "docs",

  markdown: {
    extractHeaders: ["h2", "h3", "h4"],
  },

  themeConfig: {
    logo: "/logo.png",

    searchPlaceholder: "Header search...",

    nav: [
      { text: "Home", link: "/" },
      { text: "Get Involved", link: "/get-involved.html" },
      { text: "Talks", link: "/talks.html" },
      { text: "Officers", link: "/officers.html" },
      {
        text: "Social Media",
        items: [
          { text: "Newsletter", link: "http://eepurl.com/cJMmqf" },
          {
            text: "Facebook Group",
            link: "https://www.facebook.com/groups/sumsucsd/",
          },
          { text: "Instagram", link: "https://www.instagram.com/sumsucsd/" },
          { text: "Twitter", link: "https://twitter.com/sumsucsd" },
          { text: "Slack Team", link: "https://ucsdsums.slack.com/" },
          {
            text: "LinkedIn",
            link: "https://www.linkedin.com/company/ucsdsums/",
          },
        ],
      },
    ],

    repo: "UCSD-SUMS/sums-vue",
    repoLabel: "Repo",
    docsDir: "src",
    editLinks: true,
    editLinkText: "Help us improve this page!",
  },

  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href:
          "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
        integrity:
          "sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z",
        crossorigin: "anonymous",
      },
    ],
  ],
};
