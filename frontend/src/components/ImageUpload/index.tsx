import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  maxSize?: number; // in bytes
  aspectRatio?: number;
  height?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5MB
  aspectRatio = 16 / 9,
  height = 200,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Check file size
    if (file.size > maxSize) {
      setError(`Le fichier est trop volumineux. Taille maximum : ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Check image dimensions
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(imageUrl);
      
      // Check aspect ratio
      const imageAspectRatio = img.width / img.height;
      const tolerance = 0.1;
      if (Math.abs(imageAspectRatio - aspectRatio) > tolerance) {
        setError(`L'image doit avoir un ratio de ${aspectRatio}`);
        return;
      }

      try {
        setIsUploading(true);
        
        // Create FormData
        const formData = new FormData();
        formData.append('image', file);

        // Upload image
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'upload');
        }

        const data = await response.json();
        onChange(data.url);
      } catch (err) {
        setError('Erreur lors de l\'upload de l\'image');
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      setError('Format d\'image invalide');
    };

    img.src = imageUrl;
  }, [maxSize, aspectRatio, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  });

  const handleDelete = () => {
    onChange(null);
    setError(null);
  };

  return (
    <Box>
      {value ? (
        <Box
          sx={{
            position: 'relative',
            height,
            backgroundColor: 'grey.100',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <img
            src={value}
            alt="Uploaded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
            onClick={handleDelete}
          >
            <DeleteIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      ) : (
        <Box
          {...getRootProps()}
          sx={{
            height,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'action.hover' : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" color="text.secondary" align="center">
                {isDragActive
                  ? 'Déposez l\'image ici'
                  : 'Cliquez ou déposez une image'}
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center">
                JPG, PNG ou WebP • Max {maxSize / 1024 / 1024}MB
              </Typography>
            </>
          )}
        </Box>
      )}
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: 'block', mt: 1 }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
