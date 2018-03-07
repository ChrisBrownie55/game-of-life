import styled from 'react-emotion'

const FlatButton = styled('button') `
    padding: 8px 15px;
    font: bold 13px Roboto;
    background-color: #1DA7B2;
    color: #fafafa;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 2px;
    transition: box-shadow 0.15s ease-in-out, background-color 0.25s ease-in-out, color 0.25s ease-in-out;
    text-transform: uppercase;
    
    &:hover:not(:disabled) {
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    }
      
    &:disabled {
      background-color: #15777F;
      color: #fafafa40;
    }
`

export default FlatButton