import React, { useState, useEffect, useRef } from 'react';
// import snackBarStyles from '../css/snack-bar.module.css';
import snackBarForLoadingStyles from '../css/snack-bar-for-loading.module.css';
// import '../css/snack-bar.module.css'
// import './Snackbar.css'; // 引入樣式
function Snackbar({ message, show }) {

    return (
        <div>
            <div
                className={snackBarForLoadingStyles.snackbar + ' ' + (show ? snackBarForLoadingStyles.show : '')}
            >
                {message}
            </div>
        </div>
    );
}

export default Snackbar;