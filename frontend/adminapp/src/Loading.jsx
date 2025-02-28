import React from 'react'

export default function Loading() {
    return (
        <>
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content bg-transparent border-0">
                    <div className="modal-body d-flex justify-content-center">
                        <div className="spinner-grow text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
