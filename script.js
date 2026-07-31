const rowData = [
    { status: "Attack [AT]", topValues: {1: "3%", 2: "6%", 3: "9%", 4: "14%", 5: "19%", 6: "24%", 7: "34%", 8: "44%", 9: "54%", 10: "69%", 11: "84%", 12: "99%", 13: "114%", 14: "129%", 15: "144%"} },
    { status: "Critical [CT]", topValues: {1: "15%", 2: "30%", 3: "45%", 4: "70%", 5: "95%", 6: "120%", 7: "170%", 8: "220%", 9: "270%", 10: "345%", 11: "420%", 12: "495%", 13: "570%", 14: "645%", 15: "720%"} },
    { status: "Block [BL]", topValues: {1: "2%", 2: "4%", 3: "6%", 4: "9%", 5: "12%", 6: "15%", 7: "21%", 8: "27%", 9: "33%", 10: "42%", 11: "51%", 12: "60%", 13: "69%", 14: "78%", 15: "87%"} },
    { status: "Evasion [EV]", topValues: {1: "12%", 2: "24%", 3: "36%", 4: "56%", 5: "76%", 6: "96%", 7: "136%", 8: "176%", 9: "216%", 10: "276%", 11: "336%", 12: "369%", 13: "456%", 14: "516%", 15: "576%"} },
    { status: "Health [HP]", topValues: {1: "2%", 2: "4%", 3: "6%", 4: "9%", 5: "12%", 6: "15%", 7: "19%", 8: "23%", 9: "27%", 10: "31%", 11: "35%", 12: "39%", 13: "44%", 14: "49%", 15: "54%"} }
];

const table = document.getElementById('myTable');

function createDropdown(row, data, rowIndex) {
    const imageMap = {
        1: 'img/cld.png',
        2: 'img/cld.png',
        3: 'img/cld.png',
        4: 'img/clc.png',
        5: 'img/clc.png',
        6: 'img/clc.png',
        7: 'img/clb.png',
        8: 'img/clb.png',
        9: 'img/clb.png',
        10: 'img/cla.png',
        11: 'img/cla.png',
        12: 'img/cla.png',
        13: 'img/cls.png',
        14: 'img/cls.png',
        15: 'img/cls.png'
    };

    const select = document.createElement('select');
    const hiddenTopValueInput = document.createElement('input');
    hiddenTopValueInput.type = 'hidden';
    hiddenTopValueInput.className = 'hidden-top-value';

    for (let i = 1; i <= 15; i++) {
        const option = document.createElement('option');
        option.value = i;
        
        // แสดงรูปใน option เมื่อกด dropdown
        option.innerHTML = `${i} <img src="${imageMap[i]}" alt="${i}" class="option-image">`;
        select.appendChild(option);
    }
    
    select.addEventListener('change', function() {
        const value = this.value;
        const topValue = data.topValues[value];
        hiddenTopValueInput.value = topValue;
        
        // Special handling for Block [BL]
        if (rowIndex === 2) {
            // Set Top Clone Value directly without % sign
            row.cells[3].textContent = topValue.replace('%', '');
            row.cells[2].textContent = ' - ';
        } else {
            calculateTopCloneValue(row);
        }
    });

    // Create a container to hold both select and hidden input
    const container = document.createElement('div');
    container.appendChild(select);
    container.appendChild(hiddenTopValueInput);

    return container;
}

function createNumberInput(row, columnIndex, rowIndex) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 7;

    // For Block [BL], disable input and set placeholder
    if (rowIndex === 2) {
        input.disabled = true;
        input.value = ' - ';
        input.style.backgroundColor = '#f0f0f0';
        input.style.color = '#888';
    } else {
        input.addEventListener('input', function(e) {
            if (!/^(\d*\.?\d*)$/.test(e.target.value)) {
                alert("กรุณาใส่ตัวเลข");
                e.target.value = e.target.value.replace(/[^\d.]/g, '');
                e.target.value = e.target.value.replace(/(\..*)\./g, '$1');
            }
            if (e.target.value.length > 7) {
                e.target.value = e.target.value.slice(0, 7);
            }
            calculateTopCloneValue(row);
        });
    }

    return input;
}

function calculateTopCloneValue(row) {
    // Find the hidden top value input
    const hiddenTopValueInput = row.querySelector('.hidden-top-value');
    const initialValueInput = row.cells[2].querySelector('input');
    const topCloneValueCell = row.cells[3];

    if (hiddenTopValueInput && initialValueInput) {
        const topValue = hiddenTopValueInput.value.replace('%', '');
        const initialValue = initialValueInput.value;

        if (initialValue && topValue) {
            const topCloneValue = (parseFloat(initialValue) * parseFloat(topValue) / 100);
            
            // แสดงผลเป็นช่วงค่าเต็มที่ใกล้เคียง
            const lowerBound = Math.floor(topCloneValue);
            const upperBound = Math.ceil(topCloneValue);
            
            // ถ้าค่าเป็นจำนวนเต็มอยู่แล้ว ให้แสดงค่าเดียวโดยไม่มีคำว่า "ประมาณ"
            if (lowerBound === upperBound) {
                topCloneValueCell.textContent = lowerBound;
            } else {
                // ถ้าไม่ใช่จำนวนเต็ม ให้แสดงค่าในรูปแบบ "ประมาณ ค่าต่ำ-ค่าสูง"
                topCloneValueCell.textContent = `ประมาณ ${lowerBound}-${upperBound}`;
            }
        } else {
            topCloneValueCell.textContent = '';
        }
    }
}

rowData.forEach(function(data, rowIndex) {
    const row = table.insertRow();
    for (let j = 0; j < 4; j++) {
        const cell = row.insertCell();
        if (j === 0) {
            cell.textContent = data.status;
        } else if (j === 1) {
            cell.appendChild(createDropdown(row, data, rowIndex));
        } else if (j === 2) {
            cell.appendChild(createNumberInput(row, j, rowIndex));
        }
    }

    // For Block [BL], set default values
    if (rowIndex === 2) {
        const dropdown = row.cells[1].querySelector('select');
        dropdown.selectedIndex = 0;
        dropdown.dispatchEvent(new Event('change'));
    }
});

// เพิ่มหลังจากโค้ด JavaScript ที่มีอยู่
document.addEventListener('DOMContentLoaded', function() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        updateSelectImage(select, selectedOption);

        // Trigger change event to calculate initial values
        select.dispatchEvent(new Event('change'));

        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            updateSelectImage(this, selectedOption);
        });
    });
    
    // เพิ่ม CSS เพื่อให้รูปใน dropdown แสดงผลถูกต้อง
    const style = document.createElement('style');
    style.textContent = `
        select option {
            display: flex !important;
            align-items: center !important;
            padding: 5px !important;
        }
        .option-image {
            display: inline-block !important;
            width: 20px !important;
            height: 20px !important;
            margin-left: 5px !important;
            vertical-align: middle !important;
        }
    `;
    document.head.appendChild(style);
});

function updateSelectImage(select, option) {
    const img = option.querySelector('img');
    if (img) {
        select.style.backgroundImage = `url('${img.src}')`;
        select.style.backgroundRepeat = 'no-repeat';
        select.style.backgroundPosition = 'right 5px center';
        select.style.backgroundSize = '20px 20px';
    }
}
