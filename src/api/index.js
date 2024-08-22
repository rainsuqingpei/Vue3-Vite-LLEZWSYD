import axios from "./axios";

export function test1({ areaCode, moduleType, stageState }) {
  return axios.POSTbyJSON(`/bmModuleInfo/GetCityBusinessTree`, {
    areaCode: areaCode,
    moduleType: moduleType,
    stageState: stageState,
  });
}

export function test2(parmes) {
  return axios.POSTbyJSON(`/bmModuleInfo/searchModuleName`, parmes);
}

export function test3() {
  return axios.get(
    `http://43.243.130.162:81/ems/base/AreaConstruction/findAllList/12/`
  );
}

export function test4(parmes) {
  return axios.POSTbyJSON(`/visitorInfo/api/imageCheck`, parmes);
}
