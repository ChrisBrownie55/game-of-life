import styled from 'react-emotion'
import { defaultProps } from 'recompose'

const RangeSlider = defaultProps({
  type: 'range',
  value: 0,
  min: 0,
  max: 10,
  step: 1
})(styled('input') `
  -webkit-appearance: none;
  width: 20rem;
  background: transparent;
  transition: opacity 0.2s ease-in-out;

  &.vertical {
    width: 10rem;
    transform: rotate(-90deg);
  }

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    transition: background 0.2s ease-in-out;
    width: 100%;
    height: 8.2px;
    cursor: pointer;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    background: #f6f6f6;
    border-radius: 25px;
    border: 1.1px solid #f6f6f6;
  }

  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    border: 0px solid #83e584;
    height: 23px;
    width: 23px;
    border-radius: 15px;
    background: #5bdae0;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -8.5px;
  }

  &:active::-webkit-slider-runnable-track {
    background: #ececec;
  }

  &::-moz-range-track {
    width: 100%;
    height: 8.2px;
    cursor: pointer;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    background: #f6f6f6;
    border-radius: 25px;
    border: 1.1px solid #f6f6f6;
  }

  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    border: 0px solid #83e584;
    height: 23px;
    width: 23px;
    border-radius: 15px;
    background: #5bdae0;
    cursor: pointer;
  }

  &::-ms-track {
    width: 100%;
    height: 8.2px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  &::-ms-fill-lower {
    transition: background 0.2s ease-in-out;
    background: #f6f6f6;
    border: 1.1px solid #f6f6f6;
    border-radius: 50px;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  }

  &::-ms-fill-upper {
    transition: background 0.2s ease-in-out;
    background: #f6f6f6;
    border: 1.1px solid #f6f6f6;
    border-radius: 50px;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  }

  &::-ms-thumb {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    border: 0px solid #83e584;
    height: 23px;
    width: 23px;
    border-radius: 15px;
    background: #5bdae0;
    cursor: pointer;
    height: 8.2px;
  }

  &:active::-ms-fill-lower {
    background: #ececec;
  }

  &:active::-ms-fill-upper {
    background: #ececec;
  }
`)

export default RangeSlider