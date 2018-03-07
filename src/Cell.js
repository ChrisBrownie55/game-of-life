import styled from 'react-emotion'
import React from 'react'
import Constants from './Constants'
import { observer } from 'mobx-react'

export default observer(function Cell(props) {
  const StyledCell = styled('button') `
    cursor: pointer;
    grid-row: span 1;
    grid-column: span 1;
    border: 0;
    outline: 0;
    transition: background-color 0.1s ease-in-out;
    background-color: ${props.store.val === Constants.ALIVE ? '#0EE57C' : props.store.val === Constants.NEW ? '#1DA7B2' : '#E84857'};
    
    &:hover {
      opacity: 0.5;
    }

    &:active {
      opacity: 1;
    }
  `
  return <StyledCell onMouseUp={props.toggle} />
})