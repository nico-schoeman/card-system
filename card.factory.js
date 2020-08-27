import { Card, UnitCard as Unit } from "./models";

export function BasicCard () {
  return {
    ...new Card()
  }
}

export function UnitCard () {
  return {
    ...new Unit(),
    name: 'UNIT'
  }
}