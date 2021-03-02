import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { useEditor } from '@craftjs/core'
import { Toolbox } from './Toolbox'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export const Viewport = ({ children, page, editMode }) => {
  const { enabled, connectors } = useEditor((state) => ({
    enabled: state.options.enabled
  }))
  const [loaded, setLoaded] = useState(false)
  const [mouseEnabled, setMouseEnabled] = useState(false)
  let unmounted = false
  // animations with setTimeouts. I know, don't judge me! :p
  useEffect(() => {
    setTimeout(() => {
      if (!unmounted) setLoaded(true)
      setTimeout(() => {
        setTimeout(() => {
          if (!unmounted) setMouseEnabled(true)
        }, 200)
      }, 400)
    }, 1000)
    return () => {
      unmounted = true
    }
  }, [])
  return (
    <div
      className={cx(['viewport'], {
        loaded: loaded,
        'mouse-enabled': mouseEnabled
      })}
    >
      {editMode ? <Header title={page} /> : null}

      <div
        className={cx([
          'flex flex-row w-full',
          {
            'h-full': !enabled,
            relative: !enabled
          }
        ])}
      >
        {editMode ? <Toolbox /> : null}

        <div className='flex-1 h-screen'>
          <div>
            <div
              className={cx([
                'craftjs-renderer h-full  w-full transition',
                {
                  'overflow-auto': enabled,
                  'bg-renderer-gray': enabled
                }
              ])}
              ref={(ref) =>
                connectors.select(connectors.hover(ref, null), null)
              }
            >
              <div
                className={cx([
                  'relative flex-col flex items-center pb-8',
                  {
                    'pt-8': enabled
                  }
                ])}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
        {editMode ? <Sidebar /> : null}
      </div>
    </div>
  )
}
