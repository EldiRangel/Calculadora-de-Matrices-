class MatrixCalculator {
    constructor() {
        this.matrixSize = 3;
        this.matrixA = [];
        this.matrixB = [];
        this.resultMatrix = [];
        this.scalarListener = null;
        this.init();
    }
    
    init() {
        console.log('Inicializando calculadora...');
        this.setupEventListeners();
        this.createMatrixInputs();
        console.log('Calculadora inicializada correctamente');
    }
    
    setupEventListeners() {
        const sizeSelector = document.getElementById('matrix-size');
        if (sizeSelector) {
            sizeSelector.addEventListener('change', (e) => {
                this.matrixSize = parseInt(e.target.value);
                this.createMatrixInputs();
            });
        }
        
        const randomBtn = document.getElementById('generate-random');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.generateRandomMatrices();
            });
        }
     
        const clearBtn = document.getElementById('clear-matrices');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearMatrices();
            });
        }
        
        const operationsGrid = document.querySelector('.operations-grid');
        if (operationsGrid) {
            operationsGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('operation-btn')) {
                    const operation = e.target.dataset.operation;
                    this.performOperation(operation);
                }
            });
        }
    }
    
    createMatrixInputs() {
        console.log('Creando matrices de tamaño:', this.matrixSize);
        this.createMatrixGrid('matrix-a', this.matrixSize);
        this.createMatrixGrid('matrix-b', this.matrixSize);
        this.hideResult();
        this.clearAlerts();
    }
    
    createMatrixGrid(containerId, size) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Contenedor no encontrado:', containerId);
            return;
        }
        
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-cell';
                input.dataset.row = i;
                input.dataset.col = j;
                
               
                if (i === j) {
                    input.value = '1';
                } else {
                    input.value = '0';
                }
                
                container.appendChild(input);
            }
        }
        console.log(`Matriz ${containerId} creada con ${size}x${size} elementos`);
    }
    
    getMatrixValues(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        
        const inputs = container.querySelectorAll('.matrix-cell');
        const size = this.matrixSize;
        const matrix = [];
        
        for (let i = 0; i < size; i++) {
            matrix[i] = [];
            for (let j = 0; j < size; j++) {
                const input = inputs[i * size + j];
                const value = parseFloat(input.value);
                matrix[i][j] = isNaN(value) ? 0 : value;
            }
        }
        
        return matrix;
    }
    
    setMatrixValues(containerId, matrix) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const inputs = container.querySelectorAll('.matrix-cell');
        const size = this.matrixSize;
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = inputs[i * size + j];
                if (input) {
                    input.value = this.formatNumber(matrix[i][j]);
                }
            }
        }
    }
    
    generateRandomMatrices() {
        console.log('Generando matrices aleatorias...');
        const size = this.matrixSize;
        
        
        const matrixA = [];
        for (let i = 0; i < size; i++) {
            matrixA[i] = [];
            for (let j = 0; j < size; j++) {
                matrixA[i][j] = Math.floor(Math.random() * 21) - 10; 
            }
        }
        
        
        const matrixB = [];
        for (let i = 0; i < size; i++) {
            matrixB[i] = [];
            for (let j = 0; j < size; j++) {
                matrixB[i][j] = Math.floor(Math.random() * 21) - 10; 
            }
        }
        
        this.setMatrixValues('matrix-a', matrixA);
        this.setMatrixValues('matrix-b', matrixB);
        
        this.hideResult();
        this.clearAlerts();
        this.showAlert('Matrices generadas con valores aleatorios entre -10 y 10', 'success');
    }
    
    clearMatrices() {
        console.log('Limpiando matrices...');
        const size = this.matrixSize;
