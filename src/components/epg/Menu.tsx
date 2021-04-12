import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import MenuMoreArrowSvg from '../../assets/icons/list-arrow.svg'
import { controlsState } from '../../atoms'
import Colors from '../../data/Colors'
import controlsShownStateSetter from '../../helpers/controlsShownStateSetter'

/**
 * Excludes the "More..." item
 */
const ITEMS_PER_PAGE = 9

const useStyles = makeStyles({
  root: {
    width: 560,
    margin: 'auto',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    position: 'relative',

    '&[data-more="true"]::after, &[data-less="true"]::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      height: 24,
      width: 32,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundImage: `url(${MenuMoreArrowSvg})`,
      right: 0,
      transformOrigin: 'center',
    },

    '&[data-more="true"]::after': {
      bottom: 0,
      transform: 'translateY(100%)',
    },

    '&[data-less="true"]::before': {
      top: 0,
      transform: 'translateY(-100%) rotate(0.5turn)',
    },
  },
})

export interface ListItem {
  text: string
  onClick?: React.MouseEventHandler<HTMLLIElement>
}

interface ListProps {
  listItems: ListItem[]
  onBack?: (e: SkyControlPressedEvent) => void
}

function SplitMenuIntoPages(items: ListItem[]): ListItem[][] {
  // One page! Easy exit!
  if (items.length <= 10) return [items]

  let itemsRemaining = [...items]
  let pages = []

  while (itemsRemaining.length > 0) {
    let page

    // If remaining items fit on one page, put them all on that page
    if (itemsRemaining.length <= 10) {
      page = itemsRemaining
      itemsRemaining = []
    }
    // Otherwise, take next 9 and add 'More...' to bottom
    else page = itemsRemaining.splice(0, 9)

    pages.push(page)
  }

  return pages
}

/**
 * Display an Sky-esque, auto-paginated, auto-numbered, keyboard-accessible, fully managed menu!
 *
 * Provide with a list of menu items, containing text and onClick handlers, and this component will handle the rest.
 *
 * If changing the `listItems` prop, remember to also pass a `key` prop to ensure the page gets reset.
 */
const Menu: React.FC<ListProps> = ({ onBack, listItems }) => {
  const classes = useStyles()
  const listRef = useRef<HTMLOListElement>(null)
  // Ensures that the Back Up button state is correctly set when the first page is loaded.
  const lastPageIndex = useRef(-1)

  const setControlsState = useSetRecoilState(controlsState)
  const [pageIndex, setPageIndex] = useState(0)

  if (lastPageIndex.current !== pageIndex) {
    lastPageIndex.current = pageIndex
    setControlsState(controlsShownStateSetter('backUp', !!(onBack || pageIndex > 0)))
  }

  // Get list of pages. Memoised for speeeeeed!
  const pages = useMemo(() => SplitMenuIntoPages(listItems), [listItems, SplitMenuIntoPages])
  const thisPage = pages[pageIndex]

  console.log(pageIndex, thisPage)

  function HandleMenuNav(e: React.KeyboardEvent<HTMLOListElement>) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return

    const li = e.target as HTMLLIElement
    const list = e.currentTarget as HTMLOListElement

    if (e.key === 'ArrowUp') {
      const prev = li.previousElementSibling as HTMLLIElement | null
      let elToFocus = prev

      if (!prev) {
        // Top of list
        // Wrap to bottom
        elToFocus = list.lastElementChild as HTMLLIElement
      }

      elToFocus.focus()
    } else if (e.key === 'ArrowDown') {
      const next = li.nextElementSibling as HTMLLIElement | null
      let elToFocus = next

      if (!next) {
        // Bottom of list
        // Wrap to top
        elToFocus = list.firstElementChild as HTMLLIElement
      }

      elToFocus.focus()
    }
  }

  useEffect(() => {
    if (listRef.current) {
      const firstLi = listRef.current.firstElementChild as HTMLLIElement
      firstLi && firstLi.focus()
    }

    function goToFirstPage(e: SkyControlPressedEvent) {
      if (pageIndex > 0 && e.detail.control === 'backUp') {
        e.stopImmediatePropagation()
        setPageIndex(0)
      } else if (pageIndex === 0 && onBack) {
        e.stopImmediatePropagation()
        onBack(e)
      }
    }

    document.addEventListener('skyControlPressed', goToFirstPage as EventListener)

    return () => {
      document.removeEventListener('skyControlPressed', goToFirstPage as EventListener)
    }
  }, [pageIndex, listRef])

  return (
    <ol
      // Use string values for the styles to work nicely
      data-more={String(pageIndex < pages.length - 1)}
      data-less={String(pageIndex > 0)}
      onKeyDown={HandleMenuNav}
      ref={listRef}
      className={clsx('thick-text', classes.root)}
    >
      {thisPage.map(item => (
        <MenuItem key={item.text} {...item} />
      ))}
      {pages.length - 1 !== pageIndex && <MenuItem text="More..." onClick={() => setPageIndex(p => p + 1)} />}
    </ol>
  )
}

const useItemStyles = makeStyles({
  root: {
    cursor: 'pointer',
    paddingLeft: 6,
    height: 32,
    fontSize: 26,
    display: 'flex',
    alignItems: 'center',
    background: Colors.main,
    color: Colors.mainText,
    textTransform: 'uppercase',
    counterIncrement: 'menu',

    outline: 'none',

    '&::before': {
      width: 80,
      alignSelf: 'stretch',
      textAlign: 'center',
      lineHeight: '32px',
      marginRight: 12,

      background: Colors.accent,
      color: Colors.accentText,

      content: 'counter(menu)',
      display: 'inline-block',
    },

    '&:hover, &:focus-visible': {
      background: Colors.mainHover,
      color: Colors.mainTextHover,

      '&::before': {
        background: Colors.accentHover,
        color: Colors.accentTextHover,
      },
    },

    '&:nth-child(10)::before': {
      content: '"0"',
    },
  },
})

type ListItemProps = {
  customNumber?: number
} & ListItem

const MenuItem: React.FC<ListItemProps> = ({ customNumber, text, onClick }) => {
  const classes = useItemStyles()

  function triggerClickOnEnter(e: React.KeyboardEvent<HTMLLIElement>) {
    if (e.key === 'Enter') {
      const li = e.target as HTMLLIElement
      li.click()
    }
  }

  return (
    <li data-number={customNumber} onKeyDown={triggerClickOnEnter} onClick={onClick} tabIndex={0} className={classes.root}>
      {text}
    </li>
  )
}

export default Menu
