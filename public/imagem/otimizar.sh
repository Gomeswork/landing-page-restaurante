#!/bin/bash

# Define a largura máxima e a qualidade
MAX_WIDTH=1200
QUALITY=80

# Usa o 'find' para localizar todas as imagens, ignorando maiúsculas/minúsculas
# e processa cada uma com o 'convert'.
find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0 | while IFS= read -r -d $'\0' img; do
  # Remove o './' do início do nome do arquivo
  clean_img="${img#./}"
  
  # Define o nome do novo arquivo .webp
  output_name="${clean_img%.*}.webp"

  # O comando mágico do ImageMagick!
  convert "$clean_img" -resize "${MAX_WIDTH}>" -quality $QUALITY -strip "$output_name"

  echo "Otimizada: $clean_img -> $output_name"
done

echo "Otimização concluída!"
