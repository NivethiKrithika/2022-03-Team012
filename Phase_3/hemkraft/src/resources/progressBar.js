import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
    "Household Info",
    "Bathrooms",
    "Appliances",
    "Done"
];

export default function ProgressBar({ step_number }) {
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={step_number} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}