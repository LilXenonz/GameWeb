// FÖRENKLAD BILDHANTERING SOM FUNGERAR BRA PÅ RENDER
export class ImageHandler {
  // TILLÅTNA BILDTYPER
  private static allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  static compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      // KONTROLLERA ATT VI KÖR I WEBBLÄSAREN
      if (typeof document === 'undefined') {
        // SERVERMILJÖ – RETURNERA ORIGINALFILEN UTAN KOMPRIMERING
        console.log('⚠️ compressImage: Server-side environment, returning original file');
        resolve(file);
        return;
      }

      const reader = new FileReader();
      const img = new Image();
      
      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error('Kunde inte läsa filen'));
          return;
        }
        
        img.onload = () => {
          try {
            // SKAPA CANVAS FÖR ATT KOMPRIMERA BILDEN
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Canvas context är inte tillgängligt'));
              return;
            }
            
            // BERÄKNA NY STORLEK MED BIBEHÅLLEN ASPEKTRATIO
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
              const scaleFactor = maxWidth / width;
              width = maxWidth;
              height = height * scaleFactor;
            }
            
            // SÄTT CANVAS-STORLEK
            canvas.width = width;
            canvas.height = height;
            
            // RITA OM BILDEN MED NYA DIMENSIONER
            ctx.drawImage(img, 0, 0, width, height);
            
            // KONVERTERA TILLBAKA TILL BLOB
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Kunde inte skapa blob'));
                return;
              }
              
              // SKAPA NY FIL FRÅN BLOB
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              
              console.log(`✅ Bild komprimerad: ${file.size} → ${compressedFile.size} bytes`);
              resolve(compressedFile);
              
            }, file.type, quality);
            
          } catch (error) {
            console.error('Kompression fel:', error);
            // RETURNERA ORIGINALFILEN OM KOMPRIMERING MISSLYCKAS
            resolve(file);
          }
        };
        
        img.onerror = () => {
          console.error('Kunde inte ladda bild för komprimering');
          resolve(file); // RETURNERA ORIGINAL OM BILDEN INTE KAN LADDAS
        };
        
        img.src = e.target.result as string;
      };
      
      reader.onerror = () => {
        console.error('Kunde inte läsa fil för komprimering');
        resolve(file); // RETURNERA ORIGINAL OM LÄSNING MISSLYCKAS
      };
      
      reader.readAsDataURL(file);
    });
  }

  // ALTERNATIV: ENKLARE SERVER-SIDE KOMPRIMERING
  static async compressImageServerSide(file: File, maxWidth: number = 800): Promise<File> {
    // METOD SOM FUNGERAR BÅDE PÅ SERVER OCH KLIENT – RETURNERAR ORIGINALFILEN
    console.log(`ℹ️ Server-side compress: File size is ${file.size} bytes`);
    
    if (file.size > 1024 * 1024 * 2) { // OM FILEN ÄR STÖRRE ÄN 2MB
      console.log('⚠️ Stor fil, överväg att komprimera på klientsidan');
    }
    
    return file; // RETURNERA ORIGINAL FÖR NU
  }
  
  // MAX FILSTORLEK (5MB)
  private static maxSize = 5 * 1024 * 1024; // 5MB I BYTES

  // VALIDERAR ENKELT ATT BILDFILEN ÄR OK
  static async validateImage(file: File): Promise<{ valid: boolean; error?: string }> {
    try {
      // KONTROLLERA ATT DET ÄR EN FIL
      if (!file || !(file instanceof File)) {
        return { valid: false, error: 'Ingen fil vald' };
      }

      // KONTROLLERA FILTYP
      if (!this.allowedTypes.includes(file.type)) {
        return { 
          valid: false, 
          error: 'Endast JPG, PNG, GIF och WebP bilder är tillåtna' 
        };
      }

      // KONTROLLERA FILSTORLEK
      if (file.size > this.maxSize) {
        const maxSizeMB = this.maxSize / (1024 * 1024);
        return { 
          valid: false, 
          error: `Filen är för stor. Max ${maxSizeMB}MB` 
        };
      }

      return { valid: true };
      
    } catch (error) {
      return { valid: false, error: 'Kunde inte validera filen' };
    }
  }

  // KONVERTERA FIL TILL BASE64 – SÄKER VERSION
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = () => {
          try {
            const result = reader.result as string;
            
            // FÖRSÖK ATT EXTRAHERA SJÄLVA BASE64-DELEN
            if (result.includes(',')) {
              // DATA-URL FORMAT: "DATA:IMAGE/JPEG;BASE64,BASE64_DATA_HÄR"
              const base64 = result.split(',')[1];
              resolve(base64);
            } else {
              // OM DET REDAN ÄR REN BASE64
              resolve(result);
            }
          } catch (error) {
            reject(new Error('Kunde inte bearbeta filen'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Kunde inte läsa filen'));
        };
        
        // ANVÄND READASDATAURL – MEST KOMPATIBELT
        reader.readAsDataURL(file);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // SKAPAR DATA-URL FÖR ATT VISA BILD
  static createImageUrl(base64Data: string | null): string {
    if (!base64Data) return '';
    
    // KONTROLLERA OM DET REDAN ÄR EN DATA-URL
    if (base64Data.startsWith('data:')) {
      return base64Data;
    }
    
    // ANNARS SKAPA DATA-URL (JPEG SOM STANDARD)
    return `data:image/jpeg;base64,${base64Data}`;
  }

  // GISSAR MIME TYPE FRÅN BASE64-INNEHÅLLET
  static getMimeType(base64Data: string): string {
    if (base64Data.startsWith('/9j/') || base64Data.startsWith('/9j/')) {
      return 'image/jpeg';
    } else if (base64Data.startsWith('iVBORw0KGgo')) {
      return 'image/png';
    } else if (base64Data.startsWith('R0lGODlh')) {
      return 'image/gif';
    } else if (base64Data.startsWith('UklGR')) {
      return 'image/webp';
    }
    return 'image/jpeg'; // STANDARD
  }
}