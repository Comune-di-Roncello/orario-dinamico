import { defineStore } from 'pinia'

interface OfficeInfo {
  colore: string
  stato: string
  ufficio: string
}

export const openOffices = defineStore('openOffices', {
  state: () => (
    {
      openNow: [] as OfficeInfo[],
    }
  ),
  actions: {
    getJson() {
      const url = "/src/assets/open-offices.json";

      fetch(url)
        .then((response) => response.json())
        .then((data) => (this.openNow = data as OfficeInfo[]))
        .catch((error) => console.log(error));
    }

  }
})
