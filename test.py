def is_prime(n):
    if n <= 1:
        return False  
    if n <= 3:
        return True 
    if n % 2 == 0 or n % 3 == 0:
        return False 
    
    for i in range(5, int(n**0.5) + 1, 6):
        if n % i == 0 or n % (i + 2) == 0:
            return False
    return True

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def find_e(phi_n):
    e = 65537
    if gcd(e, phi_n) == 1:
        return e
    for e in range(3, phi_n, 2): 
        if gcd(e, phi_n) == 1:
            return e
    raise ValueError("Failed to find a valid e.")

def find_d(e, phi_n):
    return pow(e, -1, phi_n)

p = int(input("Enter a prime value for p: "))
while not is_prime(p):
    p = int(input("Invalid input. Please enter a prime number: "))

q = int(input("Enter a prime value for q: "))
while not is_prime(q):
    q = int(input("Invalid input. Please enter a prime number: "))

n = p * q
phi_n = (p - 1) * (q - 1)
e = find_e(phi_n)
d = find_d(e, phi_n)

m = input("Please enter the message you'd want to encrypt: ")

print(f"Encrypting {m}:")

encrypted_m = []
decrypted_encrypted_m = ""

for c in m:
    print(f"Encrypting character {c}: ", end = "")
    encrypted_c = pow(ord(c), e, n)
    encrypted_m.append(encrypted_c)
    print(encrypted_c)

print(f"Message {m} has been encrypted into:")
print(encrypted_m)

print("Now decrypting encrypted message:")
for c in encrypted_m:
    print(f"Decrypting {c}: ", end = "")
    decrypted_c = pow(c, d, n)
    decrypted_encrypted_m += chr(decrypted_c)
    print(decrypted_c)

print(f"Decryption results: {decrypted_encrypted_m}")