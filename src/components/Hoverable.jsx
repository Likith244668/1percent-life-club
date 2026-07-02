import { useState } from 'react'

/**
 * React replacement for the original `style-hover="..."` runtime attribute.
 *
 * In the source page a tiny script layered the styles declared in
 * `style-hover` on top of the base inline style on mouseenter/focus and
 * removed them on mouseleave/blur. This component does the same thing the
 * React way: it merges `hoverStyle` into `style` while the element is hovered
 * or keyboard-focused.
 *
 * Usage:
 *   <Hoverable as="a" href="#join"
 *     style={{ color: '#fff' }}
 *     hoverStyle={{ background: '#15110D' }}>
 *     Join the club
 *   </Hoverable>
 */
export default function Hoverable({
  as: Tag = 'div',
  style,
  hoverStyle,
  children,
  ...rest
}) {
  const [active, setActive] = useState(false)
  const activate = () => setActive(true)
  const deactivate = () => setActive(false)

  return (
    <Tag
      style={active && hoverStyle ? { ...style, ...hoverStyle } : style}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      {...rest}
    >
      {children}
    </Tag>
  )
}
