import axios from "axios";

const API = axios.create({
    baseURL: "https://sparsh-cig6.onrender.com//api"
});

export default API;