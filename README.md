
# RSA Visualizer

This project implements the RSA algorithm and provides a visualizer to demonstrate key generation, encryption, and decryption steps. RSA is one of the most widely used public key cryptosystems for secure data transmission. The algorithm is based on the difficulty of factoring large prime numbers, making it a strong method for encryption.

---

## Table of Contents

- [Overview](#overview)
- [Key Concepts](#key-concepts)
  - [Prime Numbers](#prime-numbers)
  - [Modular Arithmetic](#modular-arithmetic)
  - [Public and Private Keys](#public-and-private-keys)
- [How It Works](#how-it-works)
  - [Key Generation](#key-generation)
  - [Encryption](#encryption)
  - [Decryption](#decryption)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

RSA is a public key encryption algorithm that uses two different keys for encryption and decryption: a public key and a private key. The public key is used to encrypt data, while the private key is used to decrypt it. The security of RSA relies on the computational difficulty of factoring large numbers that are the product of two prime numbers.

The RSA Visualizer allows you to:
1. **Generate RSA Keys**: Input two prime numbers, `p` and `q`, to generate the public and private keys.
2. **Encrypt a Message**: Encrypt a message using the public key.
3. **Decrypt a Message**: Decrypt the previously encrypted message using the private key.
4. **Visualize Key Operations**: View the key generation, encryption, and decryption processes in real-time with clear step-by-step calculations.

---

## Key Concepts

### Prime Numbers
RSA relies on the properties of prime numbers. These are natural numbers greater than 1 that cannot be formed by multiplying two smaller natural numbers. The two prime numbers, `p` and `q`, are selected during the key generation process.

### Modular Arithmetic
RSA heavily uses modular arithmetic, specifically `mod n`. Modular arithmetic is a system of arithmetic for integers where numbers "wrap around" after reaching a certain value (the modulus). For example, in modulo 7 arithmetic, the numbers would wrap around after 7 (i.e., 8 mod 7 = 1).

### Public and Private Keys
The public key is shared openly and is used to encrypt data. The private key is kept secret and is used to decrypt data. The two keys are related mathematically but cannot be easily derived from one another, making RSA secure.

---

## How It Works

### Key Generation
1. **Choose two prime numbers**: `p` and `q` are selected randomly. These prime numbers must be large to ensure security.
2. **Compute `n`**: `n = p * q`, which is used as part of both the public and private keys.
3. **Compute Euler's Totient**: `phi(n) = (p - 1) * (q - 1)`.
4. **Choose `e` (public exponent)**: `e` is chosen such that `1 < e < phi(n)` and `e` is coprime to `phi(n)`. The most common value for `e` is 65537.
5. **Compute `d` (private exponent)**: `d` is the modular multiplicative inverse of `e` mod `phi(n)`. This means that `(e * d) % phi(n) = 1`.

At this point, the public key is `(e, n)` and the private key is `(d, n)`.

### Encryption
To encrypt a message, we use the public key `(e, n)`:
- Convert the plaintext message into its corresponding numerical form.
- Encrypt each number `m` using the formula `c = m^e mod n`, where `c` is the ciphertext.

### Decryption
To decrypt the ciphertext, we use the private key `(d, n)`:
- For each ciphertext `c`, compute the plaintext `m` using the formula `m = c^d mod n`.
- Convert the resulting numbers back to characters to obtain the original message.

---

## Usage

### Key Generation
1. Input two prime numbers `p` and `q` in the respective input fields.
2. Click "Generate Keys" to generate the public and private keys.
3. The generated keys will be displayed in the results box.

### Encrypting a Message
1. Enter a message to encrypt in the "Message" input field.
2. Click "Encrypt" to encrypt the message.
3. The encrypted message will be displayed along with step-by-step calculations.

### Decrypting a Message
1. After encrypting a message, click "Start Decryption".
2. The decrypted message will be displayed, along with the decryption process.

---

## Technologies Used

- **HTML**: Structure and layout of the web interface.
- **CSS (Bulma)**: Styling and design of the application using the Bulma framework.
- **JavaScript**: Implementation of RSA algorithm logic and functionality for encryption, decryption, and key generation.
- **Modal**: For displaying detailed information about the RSA calculations.