
funny_wait_msgs = ['C\'est bientôt cuit !', 'Cocotte Minute papillon !',
'T\'as de beaux œufs tu sais !', 'Le gaspi salsifis !',
'Soit pas pressée l\'orange !', 'Comment est votre blanquette ?',
'Izly c\'est easy !', 'Tu t\'es vu dans ton RU ?']

function get_random_funny_wait_msgs() {
  return funny_wait_msgs[Math.floor(Math.random() * funny_wait_msgs.length)];
}
