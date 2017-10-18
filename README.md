# Popeye-rater

This application was used to assess 134 patient photographs for the presence of a Popeye sign. Assessment was done by orthopaedic surgeons, who reported their judgement about the presence of a Popeye sign (Yes/No) and their certainty (Very Certain / Slightly Certain / Neither Certain nor Uncertain / Slightly Uncertain / Very Uncertain).

The application is run offline, due to the sensitive nature of patients' photographs.

Patient photographs should be saved in the 'images' folder, and should be named 'img (1)', 'img (2)', 'img (3)' etc. and should have the .JPG file extension.

Pictures are randomized in order using a Fisher-Yates shuffle when the application is started.

When completed, a .csv file can be downloaded containing: Picture order, picture source, Popeye assessment and Likert score.
