import React from 'react'
import Cell from './Cell'
import { css } from 'emotion'
import { observer } from 'mobx-react'

export default observer(class CellGrid extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', () => this.forceUpdate())
  }

  render() {
    const minWidthHeight = Math.min(window.innerWidth, window.innerHeight) * 0.7,
      cells = this.props.grid.map((store, index) => <Cell store={store} toggle={() => this.props.toggleCell(index)} key={index} />),
      cellGridStyle = css`
            display: grid;
            grid-template-rows: repeat(${this.props.size}, 1fr);
            grid-template-columns: repeat(${this.props.size}, 1fr);
            grid-gap: 0.1rem;
            grid-column: 2;
            background-color: #fafafa;
            width: ${minWidthHeight}px;
            height: ${minWidthHeight}px;
            margin: auto;

            & > button:first-child {
              border-top-left-radius: 4px;
            }

            & > button:nth-last-child(${this.props.size}) {
              border-bottom-left-radius: 4px;
            }

            & > button:nth-child(${this.props.size}) {
              border-top-right-radius: 4px;
            }

            & > button:last-child {
              border-bottom-right-radius: 4px;
            }
          `

    return (
      <section className={cellGridStyle}>
        {cells}
      </section>
    )
  }
})