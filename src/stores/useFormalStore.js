import { defineStore } from "pinia";

export const useFormalStore = defineStore("formal", {
  state: () => ({
    env: "/formalHomes",
    areaCode: "2100",
    fwzCode: "",
    mac: "",
    moduleUrl: "",
    moduleCode: "",
    moduleType: "",
  }),
  getters: {
    getEnv() {
      return this.env || "";
    },
    getAreaCode() {
      return this.areaCode || "";
    },
    getFwzCode() {
      return this.fwzCode || "";
    },
    getMac() {
      return this.mac || "";
    },
    getModuleUrl() {
      return this.moduleUrl || "";
    },
    getModuleCode() {
      return this.moduleCode || "";
    },
    getModuleType() {
      return this.moduleType || "";
    },
  },
  actions: {
    increment() {
      this.count++;
    },
    setEnv(env) {
      this.env = env ? env : "";
    },
    setAreaCode(areaCode) {
      this.areaCode = areaCode ? areaCode : "";
    },
    setFwzCode(fwzCode) {
      this.fwzCode = fwzCode ? fwzCode : "";
    },
    setMac(mac) {
      this.mac = mac ? mac : "";
    },
    setModuleUrl(moduleUrl) {
      this.moduleUrl = moduleUrl ? moduleUrl : "";
    },
    setModuleCode(moduleCode) {
      this.moduleCode = moduleCode ? moduleCode : "";
    },
    setModuleType(moduleType) {
      this.moduleType = moduleType ? moduleType : "";
    },
  },
});
