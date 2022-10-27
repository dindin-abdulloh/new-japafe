import React from 'react'
import {MdPermPhoneMsg, MdMarkEmailRead, MdRemoveRedEye} from "react-icons/md"

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
          <div className='modal-content tw-border-none tw-shadow-lg tw-relative tw-flex tw-flex-col tw-w-full tw-pointer-events-auto tw-bg-white tw-bg-clip-padding tw-rounded-md tw-outline-none tw-text-current'>
            <div className='modal-header tw-bg-[#62C654] tw-h-[66px] tw-flex tw-flex-shrink-0 tw-items-center tw-justify-between tw-py-2 tw-px-6 tw-border-b tw-border-gray-200 tw-rounded-t'>
            <div className='tw-flex tw-gap-1'>
                  <div className='tw-bg-[#FFFFFF] tw-w-[41.44px] tw-h-[40px] tw-rounded-full tw-mt-[6px] tw-p-[9.5px] tw-text-[#62C654]'>
                    <MdRemoveRedEye size={22}/>
                  </div>

                  <div className='tw-mt-[6px]'>
                    <h6 className='tw-text-[16px] tw-text-[#EEEEEE] tw-font-[700]'>View {valAksi.nama} </h6>
                    <h6 className='tw-text-[#EEEEEE] tw-font-[700] tw-text-sm tw-pt-[8px]'>Supplier ID #{valAksi.id_customer}</h6>
                  </div>
                  </div>
            </div>
            <div className='modal-body tw-relative tw-py-2 tw-px-6'>
              {/* //content */}
              <h2 className='tw-text-[18px] tw-text-[#000000] tw-font-bold tw-pt-[15px]'>Customer</h2>
              <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                  <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Customer Name :</p>
                  <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{valAksi.nama}</h6>
              </div>

              {valAksi.addrescus.map((val, id) => {
                return (
                  <div key={id}>
                    <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                      <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Province :</p>
                      <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{val.provinsi}</h6>
                      <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>City :</p>
                      <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{val.kota}</h6>
                    </div>

                    <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                      <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Districts :</p>
                      <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{val.kecamatan}</h6>
                      <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Sub District :</p>
                      <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{val.kelurahan}</h6>
                      <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Postal Code :</p>
                      <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{val.kodepos}</h6>
                    </div>

                    <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                      <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Office Address :</p>
                      <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{val.alamat_penerima}</h6>
                    </div>

                    <div className='tw-flex tw-gap-2 tw-pt-[8px]'>
                      <p className='tw-text-[#666666] tw-text-[14px] tw-font-[400]'>Workshop Address :</p>
                      <h6 className='tw-text-[#000000] tw-text-[14px] tw-font-semibold tw-translate-y-1'>{val.alamat_workshop}</h6>
                    </div>
                  </div>
                )
              })}

              <h2 className='tw-text-[18px] tw-text-[#000000] tw-font-bold tw-pt-[15px]'>Contact Person</h2>
              <div className=' tw-mt-2 tw-overflow-x-auto'>
                  <table className='tw-w-full'>
                    <thead className='tw-bg-white'>
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
                          Name
                        </th>
                        <th
                          scope='tw-col'
                          className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                        >
                          Phone Number
                        </th>
                        <th
                          scope='tw-col'
                          className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                        >
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        valAksi.cuskontak.map((i, idx) => {
                          return (
                            <tr
                              key={idx}
                              className='hover:tw-bg-sky-100'
                            >
                              <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                {idx + 1}
                              </td>
                              <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                {i.contact_person}
                              </td>
                              <td className='tw-text-sm  tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                <div className='tw-flex tw-gap-1'>
                                  <MdPermPhoneMsg size={14.93} className='tw-text-[#007A64] tw-translate-y-[3px]'/> {i.contact_person_telp}
                                </div>
                              </td>
                              <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                <div className='tw-flex tw-gap-1'>
                                  <MdMarkEmailRead size={14.93} className='tw-text-[#007A64] tw-translate-y-[3px]'/> {i.email_person}
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
              </div>
            </div>
            <div className='modal-footer tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-end tw-py-2 tw-px-6 tw-border-t tw-border-gray-200 tw-rounded-b-md'>
              <button
                type='button'
                className='tw-w-[75px] tw-h-[47px] tw-bg-[#62C654] tw-rounded-full tw-text-[#FFFFFF]'
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
