<template>
  <audio src="http://www.soundjay.com/button/beep-07.wav" autoplay="false" ></audio>
</template>

<script>
export default {
  methods: {
    playSound() {
      var sound = document.getElementById("audio");
      sound.play();
    }
  },
}
</script>
