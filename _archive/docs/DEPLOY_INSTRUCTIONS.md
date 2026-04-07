# Deploy Instructions - InhabitMe

## Problema
El webhook GitHub → Vercel no siempre detecta los pushes automáticamente.

## Soluciones

### Opción 1: Script PowerShell (Recomendado)

Usa el script `deploy.ps1`:

```powershell
# Deploy con mensaje personalizado
.\deploy.ps1 "Fix authentication loading state"

# Deploy rápido (usa mensaje por defecto)
.\deploy.ps1
```

**El script hace:**
1. git add .
2. git commit -m "mensaje"
3. git push origin production
4. Trigger Vercel deploy hook
5. Muestra el Job ID

---

### Opción 2: Comando Manual

Si prefieres control total:

```powershell
# 1. Commit y push
git add .
git commit -m "Tu mensaje"
git push origin production

# 2. Trigger deploy
Invoke-RestMethod -Uri "https://api.vercel.com/v1/integrations/deploy/prj_pIlF8oUAULuSAQCIfuS54V9Vc7e2/KSVKJ26Kk8" -Method POST
```

---

### Opción 3: Git Alias

Crea un alias para deploy automático:

```bash
# Ejecuta esto UNA VEZ
git config alias.deploy '!f() { git push origin production && curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_pIlF8oUAULuSAQCIfuS54V9Vc7e2/KSVKJ26Kk8; }; f'

# Luego usa:
git deploy
```

---

## Verificar Deployment

1. Ve a: https://vercel.com/paparatsi40s-projects
2. Click en "inhabitme"
3. Pestaña "Deployments"
4. Verifica que el último deployment esté "Building" o "Ready"

---

## Troubleshooting

### El webhook NO detecta pushes

**Causa:** Vercel GitHub App no tiene permisos de webhook

**Solución:**
1. GitHub Settings → Applications → Installed GitHub Apps
2. Vercel → Configure
3. Repository permissions → Webhooks: **Read & Write**
4. Save

### Deploy Hook da error "not found"

**Causa:** El Deploy Hook fue eliminado

**Solución:**
1. Vercel Dashboard → Settings → Git → Deploy Hooks
2. Create new hook:
   - Name: `manual-deploy`
   - Branch: `production`
3. Actualiza el URL en `deploy.ps1` y estos docs

### Commit `db4b9e4` no deployed

**Causa:** Ese commit fue antes del webhook fix

**Solución:** Ya está incluido en commit `5db4140`, no te preocupes

---

## Status Actual

- ✅ **Último commit:** 5db4140 (Fix auth loading state)
- ✅ **Deploy Hook:** Funcionando
- ❌ **Webhook automático:** Inestable
- ✅ **Script PowerShell:** Creado

---

**Última actualización:** 2026-01-21 11:03 PM
