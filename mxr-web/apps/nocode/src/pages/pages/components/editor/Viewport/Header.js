import React from 'react'
import { useEditor } from '@craftjs/core'
import styled from 'styled-components'
import Checkmark from '@material-ui/icons/Check'
import Customize from '@material-ui/icons/Edit'
import cx from 'classnames'

const HeaderDiv = styled.div`
  width: ${(props) => (props.enabled ? '100%' : '800px')};
  z-index: 99999;
  position: sticky;
  paddingtop: 7px;
  paddingbottom: 7px;
  ${(props) =>
    !props.enabled
      ? `
    backdrop-filter: blur(12px);
    background: #ccccccc2;
    color:#2d2d2d;
  `
      : ''}
`

const Btn = styled.a`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 3px;
  color: #fff;
  font-size: 13px;
  svg {
    margin-right: 6px;
    width: 12px;
    height: 12px;
    fill: #fff;
    opacity: 0.9;
  }
`
export const Header = (props) => {
  const {
    enabled,
    actions: { setOptions }
  } = useEditor((state) => ({
    enabled: state.options.enabled
  }))

  return (
    <HeaderDiv
      enabled={enabled}
      className='header bg-light-gray-1 text-white transition w-full'
    >
      <div
        className='items-center flex w-full px-4'
        style={{ paddingTop: 14, paddingBottom: 14 }}
      >
        <div className='flex-1'>
          <h2 className='mr-5 text-xl'>{props.title}</h2>
        </div>

        <div className='flex'>
          <Btn
            className={cx([
              'transition cursor-pointer',
              {
                'bg-green-400': enabled,
                'bg-primary': !enabled
              }
            ])}
            onClick={() => {
              setOptions((options) => (options.enabled = !enabled))
            }}
          >
            {enabled ? <Checkmark /> : <Customize />}
            {enabled ? 'Finish Editing' : 'Edit'}
          </Btn>
        </div>
      </div>
    </HeaderDiv>
  )
}
