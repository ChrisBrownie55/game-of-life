import { extendObservable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { injectGlobal } from 'emotion'
import styled from 'react-emotion'
import Constants from './Constants'
import FlatButton from './FlatButton'
import CellGrid from './CellGrid'
import RangeSlider from './RangeSlider'

injectGlobal`
  body {
    margin: 0;
  }
`

class CellStore {
  constructor(val) {
    extendObservable(this, {
      _val: val,
      get val() {
        return this._val
      },
      toggle: action(() => {
        this._val = this.val === Constants.DEAD ? Constants.NEW : Constants.DEAD
      }),
      kill: action(() => {
        this._val = Constants.DEAD
      }),
      new: action(() => {
        this._val = Constants.NEW
      }),
      old: action(() => {
        this._val = Constants.ALIVE
      })
    })
  }
}

const App = observer(class App extends React.Component {

  constructor() {
    super()

    extendObservable(this, {
      _size: 10,
      generation: 0,
      speed: 150,
      set size(newSize) {
        this._size = newSize
        this.grid = Array(newSize ** 2).fill().map(() => new CellStore(Constants.DEAD))
      },
      get size() {
        return this._size
      },
      grid: Array(10 ** 2).fill().map(() => new CellStore(Constants.DEAD)),
      running: false
    })

    this.alive = new Set()

    this.clear = action(this.clear.bind(this))
    this.next = this.next.bind(this)
    this.run = action(this.run.bind(this))
    this.stop = action(this.stop.bind(this))
    this.randomize = action(this.randomize.bind(this))
    this.handleSizeSlider = action(this.handleSizeSlider.bind(this))
    this.handleSpeedSlider = action(this.handleSpeedSlider.bind(this))
    this.toggleCell = action(this.toggleCell.bind(this))

    this.gameTimer = null
  }

  componentWillMount() {
    this.size = 10
    this.randomize()
  }

  componentDidMount() {
    this.run()
  }

  next() {
    const changes = [],
      toCheck = new Set(this.alive)

    toCheck.forEach(pos => {
      const cell = this.grid[pos],
        x = pos % this.size,
        y = (pos - x) / this.size,
        up = y !== 0,
        right = x !== this.size - 1,
        down = y !== this.size - 1,
        left = x !== 0,
        isAlive = storePos => this.grid[storePos].val === Constants.ALIVE || this.grid[storePos].val === Constants.NEW
       
       const neighbors = [
        [up, pos - this.size],
        [right, pos + 1],
        [down, pos + this.size],
        [left, pos - 1],
        [up && right, pos - this.size + 1],
        [up && left, pos - this.size - 1],
        [down && right, pos + this.size + 1],
        [down && left, pos + this.size - 1]
      ]

      let aliveCount = 0
      neighbors.some(neighbor => {
        if (neighbor[0] && isAlive(neighbor[1])) {
          ++aliveCount
        }
        return aliveCount >= 4
      })

      if (isAlive(pos)) {
        // if Cell is alive (not a neighbor) check neighbors
        neighbors.forEach(neighbor => {
          if (neighbor[0] && !toCheck.has(neighbor[1]))
            toCheck.add(neighbor[1])
        })

        if (aliveCount < 2 || aliveCount > 3) {
          changes.push(() => cell.kill())
          this.alive.delete(pos)
        } else if (cell.val === Constants.NEW) {
          changes.push(() => cell.old())
        }
      } else {
        if (aliveCount === 3) {
          changes.push(() => cell.new())
          this.alive.add(pos)
        }
      }
    })

    changes.forEach(change => change())

    if (!this.alive.size)
      return this.stop()

    this.gameTimer = setTimeout(this.next, this.speed)
    this.generation = this.generation + 1
  }

  nextOld() {
    const grid = this.grid.map(store => store.val),
      changes = []

    for (let y = 0; y < this.size; ++y) {
      for (let x = 0; x < this.size; x++) {
        const pos = (this.size * y) + x,
          cell = this.grid[pos],
          up = y !== 0,
          right = x !== this.size - 1,
          down = y !== this.size - 1,
          left = x !== 0,
          isAlive = value => value === Constants.ALIVE || value === Constants.NEW

        let aliveCount = 0;
        [
          () => up && isAlive(grid[pos - this.size]),
          () => up && right && isAlive(grid[pos - this.size + 1]),
          () => right && isAlive(grid[pos + 1]),
          () => right && down && isAlive(grid[pos + this.size + 1]),
          () => down && isAlive(grid[pos + this.size]),
          () => down && left && isAlive(grid[pos + this.size - 1]),
          () => left && isAlive(grid[pos - 1]),
          () => left && up && isAlive(grid[pos - this.size - 1])
        ].some(next => {
          if (next()) {
            ++aliveCount
          }
          return aliveCount >= 4
        })

        if (isAlive(cell.val)) {
          if (aliveCount < 2 || aliveCount > 3)
            changes.push(() => cell.kill())
          else if (cell.val === Constants.NEW)
            changes.push(() => cell.old())
        } else {
          if (aliveCount === 3)
            changes.push(() => cell.new())
        }
      }
    }
    changes.forEach(change => change())
    if (!this.grid.some(it => it.val !== Constants.DEAD) || !this.running)
      return this.stop()
    else
      this.gameTimer = setTimeout(this.next, this.speed)

    this.generation = this.generation + 1
  }

  run() {
    this.running = true
    this.gameTimer = setTimeout(this.next, this.speed)
  }

  stop() {
    this.running = false
    clearTimeout(this.gameTimer)
    this.gameTimer = null
  }

  clear() {
    this.stop()
    this.grid.forEach(state => state.val !== Constants.DEAD && state.kill())
    this.alive.clear()
    this.generation = 0
  }

  randomize() {
    this.grid.forEach((store, index) => {
      if (Math.random() < 0.3) {
        if (store.val !== Constants.DEAD) {
          store.kill()
          this.alive.delete(index)
        } else if (store.val !== Constants.NEW) {
          store.new()
          this.alive.add(index)
        }
      }
    })
    this.generation = 0
  }

  toggleCell(index) {
    this.grid[index].toggle()
    if (this.grid[index].val === Constants.DEAD)
      this.alive.delete(index)
    else
      this.alive.add(index)
  }

  handleSizeSlider(event) {
    this.size = parseInt(event.target.value, 10)
    this.clear()
  }

  handleSpeedSlider(event) {
    this.speed = parseInt(event.target.value, 10)
  }

  render() {
    return (
      <Main>
        <ActionBar>
          <FlatButton disabled={this.running} onClick={this.run}>Run</FlatButton>
          <FlatButton disabled={!this.running} onClick={this.stop}>Stop</FlatButton>
          <FlatButton onClick={this.clear}>Clear</FlatButton>
          <FlatButton onClick={this.randomize}>Randomize</FlatButton>
          <Generation>Generation<br />{this.generation}</Generation>
        </ActionBar>
        <GridWrapper>
          <RangeSlider className='vertical' disabled={this.running} value={this.speed} min='50' max='500' step='-1' onInput={this.handleSpeedSlider} onChange={this.handleSpeedSlider} />
          <CellGrid toggleCell={this.toggleCell} grid={this.grid} size={this.size} />
          <RangeSlider className='vertical' disabled={this.running} value={this.size} min='5' max='30' step='1' onInput={this.handleSizeSlider} onChange={this.handleSizeSlider} />
        </GridWrapper>
      </Main>
    )
  }
})

const Generation = styled('p') `
  font-family: Roboto;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  color: #222;
`

const ActionBar = styled('section') `
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;

  & > button {
    width: 5.5rem;
    padding-left: 0;
    padding-right: 0;

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
`

const Main = styled('main') `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
  padding: 2rem;
  min-height: calc(100vh - 4rem);
`

const GridWrapper = styled('section') `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0 3rem;

  & > input[type=range] {
    position: absolute;

    &:first-child {
      left: -3.5rem;
    }

    &:last-child {
      right: -3.5rem;
    }
  }
`

export default App