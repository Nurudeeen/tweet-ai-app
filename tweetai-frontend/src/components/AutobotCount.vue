<template>
    <div>
      <h1>Autobot Count: {{ autobotCount }}</h1>
    </div>
  </template>
  
  <script>
  import { io } from "socket.io-client";
  
  export default {
    data() {
      return {
        autobotCount: 0,
        socket: null
      };
    },
    mounted() {
      console.log("Connecting to WebSocket...");
      this.socket = io("http://localhost:3000"); // Adjust the URL to your server
  
      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });
  
      this.socket.on("autobotCount", (count) => {
        console.log("Received autobotCount:", count);
        this.autobotCount = count;
      });
  
      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });
  
      this.socket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
      });
    },
    beforeUnmount() {
      if (this.socket) {
        this.socket.disconnect();
        console.log("WebSocket disconnected");
      }
    }
  };
  </script>
  
  <style scoped>
  h1 {
    color: #333;
  }
  </style>
  