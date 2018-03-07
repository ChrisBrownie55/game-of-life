import React from 'react'
import ReactDOM from 'react-dom'
import CellGrid from 'CellGrid'
import { mount } from "enzyme"

describe('CellGrid', () => {
  let props, mountedCellGrid

  const cellGrid = () => {
    if (!mountedCellGrid) {
      mountedCellGrid = mount(<CellGrid {...props} />)
    }

    return mountedCellGrid
  }

  beforeEach(() => {
    props = {

    }

    mountedCellGrid = undefined
  })
})