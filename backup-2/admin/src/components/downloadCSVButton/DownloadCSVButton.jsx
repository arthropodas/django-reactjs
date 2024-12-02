import React from 'react'
import ClickButton from '../button/OnClickButton';
import { clickButtonColor } from '../../utils/Strings';

const generateCSV = ({ filename, headers, buttonLabel, width }) => {

    const downloadCSV = () => {

        const csvContent = [
            headers.join(',')
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    return (
        <ClickButton
            label={buttonLabel}
            bgColor={clickButtonColor}
            width={width || "50%"}
            height="40px"
            onClick={downloadCSV}
        />
    )
}

export default generateCSV