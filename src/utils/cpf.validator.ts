/**
 * Valida CPF usando o algoritmo oficial da Receita Federal
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF é válido
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(numbers)) {
    return false;
  }
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers[i - 1]) * (11 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(numbers[9])) {
    return false;
  }
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers[i - 1]) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(numbers[10])) {
    return false;
  }
  
  return true;
};

/**
 * Formata CPF para o padrão 000.000.000-00
 * @param cpf - CPF sem formatação
 * @returns CPF formatado
 */
export const formatCPF = (cpf: string): string => {
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length <= 3) {
    return numbers;
  }
  
  if (numbers.length <= 6) {
    return numbers.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }
  
  if (numbers.length <= 9) {
    return numbers.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  }
  
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
};

/**
 * Remove formatação do CPF
 * @param cpf - CPF formatado
 * @returns CPF apenas com números
 */
export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};