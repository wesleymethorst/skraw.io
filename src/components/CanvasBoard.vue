<template>
    <div class="canvas-container">
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CanvasBoard',
    props: ['color'],
    mounted() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
  
      const resizeCanvas = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      };
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
  
      let drawing = false;
      let lastX = 0;
      let lastY = 0;
  
      canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      });
  
      canvas.addEventListener("mouseup", () => {
        drawing = false;
        ctx.beginPath();
      });
  
      canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
  
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.lineCap = "round";
  
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
  
        lastX = x;
        lastY = y;
      });
  
      this.clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
    },
    methods: {
      clear() {
        this.clearCanvas();
      }
    }
  }
  </script>
  
  <style scoped>
  .canvas-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    overflow: hidden;
  }
  
  canvas {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    background-color: white;
    cursor: crosshair;
    object-fit: contain;
  }
  </style>
  