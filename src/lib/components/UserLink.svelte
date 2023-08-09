<script lang="ts">

    export let iconURL = 'ha';
    export let icon = 'default';
    export let url = 'foo';
    export let title = 'some cool title';
    export let previewMode = false;
    export let buttonStyle: keyof typeof buttonStyles;

    
    let buttonRadius = '';
    let fill = false;
    let outline = false;
    let shadow = false;

    export const buttonStyles = {
      squareFill: {
        buttonRadius: 'none',
        fill: true,
        outline: false,
        shadow: false,
      },
      roundFill: {
        buttonRadius: '[0.5rem]',
        fill: true,
        outline: false,
        shadow: false,
      },
      circleFill: {
        buttonRadius: 'full',
        fill: true,
        outline: false,
        shadow: false,
      },
      squareOutline: {
        buttonRadius: 'none',
        outline: true,
        fill: false,
        shadow: false,
      },
      roundOutline: {
        buttonRadius: '[0.5rem]',
        outline: true,
        fill: false,
        shadow: false,
      },
      circleOutline: {
        buttonRadius: 'full',
        outline: true,
        fill: false,
        shadow: false,
      },
      squareShadow: {
        buttonRadius: 'none',
        shadow: true,
        fill: false,
        outline: false,
      },
      roundShadow: {
        buttonRadius: '[0.5rem]',
        shadow: true,
        fill: false,
        outline: false,
      },
      circleShadow: {
        buttonRadius: 'full',
        shadow: true,
        fill: false,
        outline: false,
      },
    };

    $: if (buttonStyle in buttonStyles) {
    let style = buttonStyles[buttonStyle];
    buttonRadius = style.buttonRadius;
    fill = style.fill;
    outline = style.outline;
    shadow = style.shadow;
    console.log(`Button style: ${buttonStyle}`);
  }
  
</script>

<a 
  href="{url}" class="{previewMode ? 'h-[43px]  p-[0.1rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} m-auto {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.5rem]'} hover:translate-x-1 hover:translate-y-1 stack text-center bg-secondary flex justify-between items-center no-underline relative">
    <img 
      
      src={iconURL} 
      alt={icon} 
      class="{previewMode? 'h-8 w-8' : ''} w-12 h-12 rounded-full">
    <span 
      class="{previewMode ? 'text-[1rem]' : 'text-[2rem]'} absolute text-accent-content font-elven text-center">{title}</span>
</a>