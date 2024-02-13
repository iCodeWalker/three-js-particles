# Particles

1. Particles can be used to create stars, smoke, rain, dust, fire etc.
2. We can create thousands of particles with a reasonable frame rate.
3. Each particle is composed of a plane (two triangles) always facing the camera.

4. Creating particle is like creating a Mesh.
   We need
   1. A geometry(BufferGeometry)
   2. A material (PointsMaterial)
   3. And instead of a Mesh we will create a Point. A Points instance (instead of a mesh)
