SUMS mentorship program mentors and mentees have been chosen!

;;;

Hi {{ name }},

{% if isMentor -%}
Your mentees are:

{% for mentee in mentees -%}
* {{ mentee.name }}, {{ mentee.email }}
{% endfor %}
{%- else -%}

Your mentor is {{ mentor.name }} and their email is "{{ mentor.email }}".

{%- endif %}

Remember to contact each other at least once a month for a minimum 30 minute checkup.
You are free to reach out to one another on other contact methods besides email.
{%- if not isMentor %} SUMS will be sending out a monthly check-in for you to fill out as well.{% endif %}

Thank you for participating in the SUMS mentorship program!
If you have any questions, just reach out to us at our email "sums@ucsd.edu".

Mentorship details: https://docs.google.com/document/d/1oZDyXyEgFbCgL5q1_OSr-NrIpuO_TVvb4ddcNk5QNDg/edit?usp=sharing

Mentorship agreement: https://docs.google.com/document/d/1RlP7iS6ArMW_JgYqYQ0sGHaj5HKC4kBEtYu_fQcJD_Y/edit?usp=sharing
