import React from 'react'
import PropTypes from 'prop-types'
import { MarkerCanvasConsumer } from '../MarkerCanvasContext'

const criticalStyles = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  // FIXME: are these critical styles?
  width: '2px',
  backgroundColor: 'pink'
}

// REVIEW: might want to memoize this as it creates a new object
// in each render which is passed to React component
const createMarkerStylesWithLeftOffset = leftOffset => ({
  ...criticalStyles,
  left: leftOffset
})

// FIXME: this is used in all marker implementations
// lift into single spot and memoize?
// eslint-disable-next-line
const defaultRenderer = ({ styles }) => (
  <div style={styles} data-testid="default-cursor-marker" />
)

class CursorMarker extends React.Component {
  static propTypes = {
    subscribeToCanvasMouseOver: PropTypes.func.isRequired,
    getLeftOffsetFromDate: PropTypes.func.isRequired,
    renderer: PropTypes.func
  }

  static defaultProps = {
    renderer: defaultRenderer
  }

  handleCanvasMouseOver = () => {
    console.log('cursor marker handle mouse over!!')
  }

  componentDidMount() {
    this.unsubscribe = this.props.subscribeToCanvasMouseOver(
      this.handleCanvasMouseOver
    )
  }

  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  render() {
    const date = 100000
    const leftOffset = this.props.getLeftOffsetFromDate(date)
    const styles = createMarkerStylesWithLeftOffset(leftOffset)

    return this.props.renderer({ styles, date })
  }
}

// TODO: turn into HOC?
const CursorMarkerWrapper = props => {
  return (
    <MarkerCanvasConsumer>
      {({ subscribeToMouseOver }) => {
        return (
          <CursorMarker
            subscribeToCanvasMouseOver={subscribeToMouseOver}
            {...props}
          />
        )
      }}
    </MarkerCanvasConsumer>
  )
}

CursorMarkerWrapper.displayName = 'CursorMarkerWrapper'

export default CursorMarkerWrapper