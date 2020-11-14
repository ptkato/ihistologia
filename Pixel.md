A única dependência externa do python é a biblioteca livre, de código aberto, "Pillow",
é possível instalá-la utilizando `pip3 install --upgrade Pillow` (ou apenas `pip`).
Também usamos a biblioteca "Flask", mas apenas para simular o ambiente de produção, ela
pode ser obtida da mesma maneira que a Pillow.

```bash
chmod +x Pixel.py
./Pixel.py <'caminho_da_imagem'> <largura_desejada>
```

ou

```bash
python3 Pixel.py <'caminho_da_imagem'> <largura_desejada>
```