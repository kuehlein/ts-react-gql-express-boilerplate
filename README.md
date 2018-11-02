boilerplate for typescript react gql express project

# DO NOT DO THIS:

## OPTIMIZATION ---

### Do not connect client to server (or vice versa) through imports:

-tsc will compile all files connected via import
-using hmr, only client side is recompiled to save time
-by connecting client and server via imports, tsc will recompile everything

### Do not watch server while using HMR

-using a tool that restarts the server (like nodemon) will significantly impact the preformance of HMR

# --------------------------------------------------------------------------

# --------------------------------------------------------------------------

# TO DO:

-should i use a prettier config?

# --------------------------------------------------------------------------

# --------------------------------------------------------------------------
