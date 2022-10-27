import React from 'react'
import moment from 'moment'
import {MdDelete} from "react-icons/md"

const ModalDetail = ({ valAksi }) => {
  return (
    <React.Fragment>
      <div
        className='modal fade tw-fixed tw-top-0 tw-left-0 tw-hidden tw-w-full tw-h-full tw-outline-none tw-overflow-x-hidden tw-overflow-y-auto'
        id='detail'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='detail'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable tw-relative tw-w-auto tw-pointer-events-none'>
          <div className='modal-content tw-border-none tw-shadow-lg tw-relative tw-flex tw-flex-col tw-w-full tw-pointer-events-auto tw-bg-white tw-bg-clip-padding tw-rounded tw-outline-none tw-text-current'>
            <div className='modal-header tw-flex tw-flex-shrink-0 tw-items-center tw-justify-between tw-py-2 tw-px-6 tw-border-b tw-border-gray-200 tw-rounded-t'>
              <h5
                className='tw-text-xl tw-font-medium tw-leading-normal tw-text-gray-800'
                id='exampleModalLabel'
              >
                Detail Employee
              </h5>
              <button
                type='button'
                className='tw-btn-close tw-box-content tw-w-4 tw-h-4 tw-p-1 tw-text-black tw-border-none tw-rounded-none tw-opacity-50 focus:tw-shadow-none focus:tw-outline-none focus:tw-opacity-100 hover:tw-text-black hover:tw-opacity-75 hover:tw-no-underline'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body tw-relative tw-py-2 tw-px-6'>
              {/* //content */}
              <h2 className='tw-text-[18px] tw-text-[#000000] tw-font-bold tw-pt-[15px]'>Employee</h2>
              <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                  <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Employee Name :</p>
                  <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{valAksi.nama_karyawan}</h6>
              </div>

              <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                  <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>NIK :</p>
                  <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{valAksi.nik}</h6>
                  <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>City :</p>
                  <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{valAksi.kota}</h6>
              </div>

              <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                  <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Gender :</p>
                  <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{valAksi.jenis_kelamin}</h6>
                  <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Birthplace :</p>
                  <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{valAksi.tgllahir}</h6>
              </div>

              <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                  <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Start joining :</p>
                  <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{valAksi.starjoin}</h6>
              </div>

              <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                  <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Employee Status :</p>
                  <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{valAksi.karyawan_status}</h6>
              </div>
              
              <div className='tw-flex tw-gap-6'>
                <div className='tw-w-1/2'>
                  <h2 className='tw-text-[18px] tw-text-[#000000] tw-font-bold tw-pt-[15px]'>Education</h2>
                  {valAksi.emppen.map((val, id) => {
                    return (
                      <div className='tw-pt-[8px]' key={id}>
                        <div className='tw-inline-flex'>
                          <p className='tw-pr-2 tw-text-[#666666] tw-text-[14px] tw-font-[400]'>{val.jns_pndidikan} :</p>
                          <p className='tw-text-[#000000] tw-text-[14px] tw-font-semibold'>{val.nama_sekolah}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className='tw-w-1/2'>
                  <h2 className='tw-text-[18px] tw-text-[#000000] tw-font-bold tw-pt-[15px]'>Family</h2>
                  <div className='tw-inline-flex'>
                    <p className='tw-pr-2 tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Spouse :</p>
                    <p className='tw-text-[#000000] tw-text-[14px] tw-font-semibold'>{valAksi.spouse_name}</p>
                  </div>
                  <div className='tw-flex tw-flex-col'>
                  {valAksi.empchild.map((val, id) => {
                    return (
                      <div className='tw-inline-flex'>
                        <p className='tw-pr-2 tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Child {id+1} :</p>
                        <p className='tw-text-[#000000] tw-text-[14px] tw-font-semibold'>{val.name_child}</p>
                      </div>
                    )
                  })}
                  </div>
                </div>
              </div>

              <h2 className='tw-text-[18px] tw-text-[#000000] tw-font-bold tw-pt-[15px]'>Certificate</h2>
              <table className='tw-w-full'>
                          <thead className='tw-bg-white tw-border-b-2 tw-border-t'>
                            <tr>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                No
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Description
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Certificate Type
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Certification Date
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                File
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              valAksi.emppel.map((i, idx) => {
                                return (
                                  <tr
                                    key={idx}
                                    className='tw-border-b hover:tw-bg-sky-100'
                                  >
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                      {idx + 1}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.ket}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.jns_pelatihan}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.wktu_selesai}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap'>
                                      <a href={`${i.upload}`} download="file" target="_blank" >Download</a>
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    <div className='modal-footer tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-end tw-py-2 tw-px-6 tw-border-t tw-border-gray-200 tw-rounded-b-md'>
                      <button
                        type='button'
                        className='hover:tw-bg-red-600 tw-inline-block tw-px-6 tw-py-2 tw-bg-red-500 tw-text-white tw-font-bold tw-text-xs tw-rounded tw-duration-150 tw-ease-in-out'
                        data-bs-dismiss='modal'
                      >
                        Close
                      </button>
                    </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ModalDetail
