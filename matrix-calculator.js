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
      
