import motorcycle from '../../../../assets/motorcycle.svg'

/**
 * Hero for the driver registration wizard: the "Cadastro de Entregador" title
 * paired with the motorcycle illustration from the design.
 */
export function RegisterHeader() {
  return (
    <header className="flex items-start justify-between">
      <h1 className="pt-3 text-[20px] font-medium leading-tight">
        <span className="block text-white">Cadastro de</span>
        <span className="block text-accent-blue">Entregador</span>
      </h1>
      <img src={motorcycle} alt="" aria-hidden className="size-[140px]" />
    </header>
  )
}
