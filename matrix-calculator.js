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

        const identityA = [];
        for (let i = 0; i < size; i++) {
            identityA[i] = [];
            for (let j = 0; j < size; j++) {
                identityA[i][j] = i === j ? 1 : 0;
            }
        }
        
        const identityB = [];
        for (let i = 0; i < size; i++) {
            identityB[i] = [];
            for (let j = 0; j < size; j++) {
                identityB[i][j] = i === j ? 1 : 0;
            }
        }
        
        this.setMatrixValues('matrix-a', identityA);
        this.setMatrixValues('matrix-b', identityB);
        
        this.hideResult();
        this.clearAlerts();
        this.showAlert('Matrices restablecidas a valores por defecto', 'success');
    }
    
    performOperation(operation) {
        console.log('Ejecutando operación:', operation);
        
        try {
            this.matrixA = this.getMatrixValues('matrix-a');
            this.matrixB = this.getMatrixValues('matrix-b');
            
            this.clearAlerts();
            
            let result;
            
            switch(operation) {
                case 'sum':
                    result = this.matrixSum(this.matrixA, this.matrixB);
                    this.showResult('A + B', result);
                    break;
                case 'subtract':
                    result = this.matrixSubtract(this.matrixA, this.matrixB);
                    this.showResult('A - B', result);
                    break;
                case 'multiply':
                    result = this.matrixMultiply(this.matrixA, this.matrixB);
                    this.showResult('A × B', result);
                    break;
                case 'scalar':
                    this.showScalarInput();
                    break;
                case 'transpose':
                    result = this.matrixTranspose(this.matrixA);
                    this.showResult('A<sup>T</sup>', result);
                    break;
                case 'determinant':
                    const det = this.matrixDeterminant(this.matrixA);
                    this.showDeterminantResult(det);
                    break;
                case 'inverse':
                    result = this.matrixInverse(this.matrixA);
                    this.showResult('A<sup>-1</sup>', result);
                    break;
                case 'identity':
                    result = this.matrixIdentity(this.matrixSize);
                    this.showResult('I<sub>' + this.matrixSize + '</sub>', result);
                    break;
                default:
                    throw new Error('Operación no reconocida');
            }
            
        } catch (error) {
            console.error('Error en operación:', error);
            this.showAlert(error.message, 'error');
        }
    }
    
    matrixSum(A, B) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Las matrices deben tener las mismas dimensiones para la suma');
        }
        
        const result = [];
        const size = A.length;
        
        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = A[i][j] + B[i][j];
            }
        }
        
        return result;
    }
    
    matrixSubtract(A, B) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Las matrices deben tener las mismas dimensiones para la resta');
        }
        
        const result = [];
        const size = A.length;
        
        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = A[i][j] - B[i][j];
            }
        }
        
        return result;
    }
    
    matrixMultiply(A, B) {
        if (A[0].length !== B.length) {
            throw new Error('El número de columnas de A debe coincidir con el número de filas de B');
        }
        
        const result = [];
        const size = A.length;
        
        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = 0;
                for (let k = 0; k < size; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        
        return result;
    }
    
    scalarMultiply(k, A) {
        const result = [];
        const size = A.length;
        
        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = k * A[i][j];
            }
        }
        
        return result;
    }
    
    matrixTranspose(A) {
        const result = [];
        const size = A.length;
        
        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                result[i][j] = A[j][i];
            }
        }
        
        return result;
    }
    
    matrixDeterminant(A) {
        const size = A.length;
        
        if (size === 1) {
            return A[0][0];
        }
        
        if (size === 2) {
            return A[0][0] * A[1][1] - A[0][1] * A[1][0];
        }
        
        let det = 0;
        for (let j = 0; j < size; j++) {
            const minor = this.getMinor(A, 0, j);
            det += A[0][j] * Math.pow(-1, j) * this.matrixDeterminant(minor);
        }
        
        return det;
    }
    
    getMinor(matrix, row, col) {
        const size = matrix.length;
        const minor = [];
        
        for (let i = 0, m = 0; i < size; i++) {
            if (i === row) continue;
            minor[m] = [];
            for (let j = 0, n = 0; j < size; j++) {
                if (j === col) continue;
                minor[m][n] = matrix[i][j];
                n++;
            }
            m++;
        }
        
        return minor;
    }
    
    matrixInverse(A) {
        const det = this.matrixDeterminant(A);
        
        if (Math.abs(det) < 1e-10) {
            throw new Error('La matriz no es invertible (determinante ≈ 0)');
        }
        
        const size = A.length;
        
        if (size === 1) {
            return [[1 / A[0][0]]];
        }
        
        if (size === 2) {
            const invDet = 1 / det;
            return [
                [A[1][1] * invDet, -A[0][1] * invDet],
                [-A[1][0] * invDet, A[0][0] * invDet]
            ];
        }
        
        const adjoint = this.matrixAdjoint(A);
        const inverse = [];
        
        for (let i = 0; i < size; i++) {
            inverse[i] = [];
            for (let j = 0; j < size; j++) {
                inverse[i][j] = adjoint[i][j] / det;
            }
        }
        
        return inverse;
    }
    
    matrixAdjoint(A) {
        const size = A.length;
        const adjoint = [];
        
        for (let i = 0; i < size; i++) {
            adjoint[i] = [];
            for (let j = 0; j < size; j++) {
                const minor = this.getMinor(A, i, j);
                const cofactor = Math.pow(-1, i + j) * this.matrixDeterminant(minor);
                adjoint[j][i] = cofactor;
            }
        }
        
        return adjoint;
    }
    
    matrixIdentity(size) {
        const identity = [];
        
        for (let i = 0; i < size; i++) {
            identity[i] = [];
            for (let j = 0; j < size; j++) {
                identity[i][j] = i === j ? 1 : 0;
            }
        }
        
        return identity;
    }

    
