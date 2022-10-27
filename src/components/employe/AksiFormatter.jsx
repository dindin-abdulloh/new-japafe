import React from 'react'
import { MdRemoveRedEye, MdOutlineEditNote, MdDelete } from 'react-icons/md'
import '../css/aksiFormatter.css'

const AksiFormatter = ({ row, showModalHandler }) => {
  return (
    <>
      <div className='tw-flex tw-gap-2 tw-items-center tw-w-full'>
        <button
          onClick={() => {
            showModalHandler('detail', row)
          }}
          className='is_view_btn'
        >
          <MdRemoveRedEye size={18} />
        </button>
        <button
          onClick={() => {
            showModalHandler('edit', row)
          }}
          className='is_edit_btn'
        >
          <MdOutlineEditNote size={18} />
        </button>
        <button
          onClick={() => {
            showModalHandler('remove', row)
          }}
          className='is_delete_btn'
        >
          <MdDelete size={18} />
        </button>
      </div>
    </>
  )
}

export default AksiFormatter
