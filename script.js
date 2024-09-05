import { faker } from "https://cdn.jsdelivr.net/npm/@faker-js/faker/+esm";

document.addEventListener('DOMContentLoaded', function () {
    const dataTypeBtns = document.querySelectorAll('.data-type-btn');
    const loremFieldCont = document.getElementById('lorem-fields-container');
    const generalFieldCont = document.getElementById('general-fields-container');

    let loremInitialized = false;

    //initial lorem container will be there so 
    loremGenerate();

    dataTypeBtns.forEach(button => {
        button.addEventListener('click', function () {
            dataTypeBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            let selectedDataType = button.getAttribute('data-type');
            if (selectedDataType === 'lorem') {
                loremFieldCont.style.display = 'block';
                generalFieldCont.style.display = 'none';

                if (!loremInitialized) {
                    loremGenerate();
                    loremInitialized = true;
                }
            } else {
                loremFieldCont.style.display = 'none';
                generalFieldCont.style.display = 'block';
                generalGenerate(selectedDataType);

                // Reset output and fields for general
                document.getElementById('general-output').innerHTML = '';
                document.getElementById('general-select-field').value = '';
                document.getElementById('general-btn').disabled = true;
                document.getElementById('general-copy-btn').disabled = true;
            }


        })
    })


    function loremGenerate() {
        const loremSelectField = document.getElementById('lorem-cont');
        const loremLength = document.getElementById('lorem-length');
        const loremButton = document.getElementById('lorem-btn');
        const loremOutput = document.getElementById('lorem-output');
        const copyButton = document.getElementById('copy-btn');

        while (loremSelectField.options.length > 1) {
            loremSelectField.remove(1);
        }
        Object.keys(faker.lorem).forEach(optValue => {
            if (typeof faker.lorem[optValue] !== 'function') return;
            const option = document.createElement('option');
            option.value = optValue;
            option.textContent = optValue;
            loremSelectField.appendChild(option);
        });

        loremSelectField.addEventListener('change', function () {
            loremButton.disabled = loremSelectField.value === "";
        });

        loremButton.addEventListener('click', function () {
            if (loremSelectField.value !== "") {
                let length = parseInt(loremLength.value, 10);
                let type = loremSelectField.value;

                let generatedLorem = length ? faker.lorem[type](length) : faker.lorem[type]();
                let formattedLorem = generatedLorem.replace(/\n/g, '<br>');
                loremOutput.innerHTML = formattedLorem;
                // console.log(generatedLorem);

                copyButton.disabled = generatedLorem === "";
                // showToast("Text generated successfully!", "success");
            }
        });

        copyButton.addEventListener('click', function () {
            const textToCopy = loremOutput.textContent;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast("Text copied to clipboard!", "success");
                }).catch(err => {
                    showToast("Failed to copy text: " + err, "error");
                });
            }
        });
    }

    function generalGenerate(selectedDataType) {
        const generalLabel = document.getElementById('general-type-label');
        let generalSelectField = document.getElementById('general-select-field');
        let generalButton = document.getElementById('general-btn');
        let generalCopyButton = document.getElementById('general-copy-btn');
        const generalOutput = document.getElementById('general-output');

        generalLabel.textContent = selectedDataType.slice(0, 1).toUpperCase() + selectedDataType.slice(1);

        while (generalSelectField.options.length > 1) {
            generalSelectField.remove(1);
        }

        Object.keys(faker[selectedDataType]).forEach(optVal => {
            if (typeof faker[selectedDataType][optVal] !== 'function') return;
            const option = document.createElement('option');
            option.value = optVal;
            option.textContent = optVal;
            generalSelectField.appendChild(option);
        })

        // Replace elements to remove any existing event listeners
        const newGeneralButton = generalButton.cloneNode(true);
        generalButton.replaceWith(newGeneralButton);
        generalButton = newGeneralButton;

        const newGeneralCopyButton = generalCopyButton.cloneNode(true);
        generalCopyButton.replaceWith(newGeneralCopyButton);
        generalCopyButton = newGeneralCopyButton;

        const newGeneralSelectField = generalSelectField.cloneNode(true);
        generalSelectField.replaceWith(newGeneralSelectField);
        generalSelectField = newGeneralSelectField;

        generalSelectField.addEventListener('change', function () {
            generalButton.disabled = generalSelectField.value === "";
        });

        generalButton.addEventListener('click', function () {
            if (generalSelectField.value !== "") {
                let type = generalSelectField.value;

                let generatedData = faker[selectedDataType][type]();
                generalOutput.innerHTML = generatedData;

                generalCopyButton.disabled = generatedData === "";
            }
        });

        generalCopyButton.addEventListener('click', function () {
            const textToCopy = generalOutput.textContent;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast("Text copied to clipboard!", "success");
                }).catch(err => {
                    showToast("Failed to copy text: " + err, "error");
                });
            }
        });


    }


    function showToast(message, type) {
        const toastDiv = document.createElement('div');
        toastDiv.className = `toast ${type} show`;
        toastDiv.textContent = message;
        document.body.appendChild(toastDiv);

        setTimeout(() => {
            toastDiv.classList.remove('show');
            toastDiv.addEventListener('transitionend', () => {
                toastDiv.remove();
            });
        }, 3000); // Duration for the toast to stay visible
    }
});
