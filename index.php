<?php 

function pr ($value) 
{ 
	echo '<pre>'; 
	print_r($value); 
	echo '</pre>'; 
}

abstract class Object
{

}

/**
 * Detecta jquery plugins e retorna suas informacoes
 */
class DetectPlugins extends Object
{
	protected static $instance;

	private function __construct() { }

	public $types_accepted = array('html');

	public $path;

	protected static function getInstance () 
	{
		if (!self::$instance) {
			self::$instance = new self;
		}
		return self::$instance;
	}

	/**
	 * Carrega todos os plugins do diretorio informado
	 * @param $path string Diretorio onde sera procurado os plugins
	 * @return $out array Todos os plugins encontrados
	 */
	public static function load($path = '.', $types_accepted = array('html'))
	{
		$self = self::getInstance();
		$self->path = $path;
		$self->types_accepted = $types_accepted;
		$files = $self->getFiles();
		$info = array();
		
		if (empty($files)) throw new Exception(_('Nenhum plugin encontrado!'));

		foreach ($files as $file) 
		{
			$info[] = $self->getInfo($file);
		}

		return $info;
	}

	/**
	 * Resgata arquivos do caminho passado
	 * @return $files array Nomes dos arquivos
	 */
	public function getFiles () 
	{
		$files = scandir($this->path);
		foreach ($files as $key => $value) 
		{
			if ( !in_array($this->getExtension($value), $this->types_accepted) ) 
			{
				unset($files[$key]);
			}
		}
		return $files;
	}

	/**
	 * Retorna extensao do arquivo
	 * @param $file string Nome do arquivo
	 * @return mixed Extensao do arquivo
	 */
	public function getExtension ($file) 
	{
		$pathinfo = pathinfo($file);
		return ( isset($pathinfo['extension']) ? $pathinfo['extension'] : null );
	}

	/**
	 * Retorna informacoes do arquivo
	 * @param $file string Nome do arquivo
	 * @return array
	 */
	public function getInfo ($file) 
	{
		$defaults = array('title' => $file, 'file' => $file);
		$info = get_meta_tags($this->path . '/' . $file);
		$info = array_merge($defaults, $info);
		return $info;
	}
}

?>
<!DOCTYPE html>
<html>
<head>
	<title>jQueryLab</title>
	<link rel="stylesheet" href="css/base.css" media="all" type="text/css" />
	<link rel="stylesheet" href="css/index.css" media="all" type="text/css" />
	<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="js/jquery.focusBox.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			$('#available-plugins').focusBox({
				reference: '.item-plugin',
				opacity: 0.2
			});
		});
	</script>
</head>
<body>
	<div class="content">
		<h1>jQueryLab</h1>
		<div id="available-plugins">
			<?php 
			
				try 
				{
					$view_words = array('Ver Plugin', 'Acessar Projeto', 'Demostração', 'Testar');
					$all_plugins = DetectPlugins::load();
					foreach ($all_plugins as $key => $value) 
					{
						$file = $value['file'];
						$image = (isset($value['image']) ? $value['image'] : '');
						$title = (isset($value['title']) ? $value['title'] : '');
						$description = (isset($value['description']) ? $value['description'] : '');

						echo sprintf('<div class="item-plugin">');
						echo sprintf('<div class="item-plugin-image">%s</div>', $image);
						echo sprintf('<div class="item-plugin-title"><a href="%s">%s</a></div>', $file, $title);
						echo sprintf('<div class="item-plugin-description">%s</div>', $description);
						echo sprintf('<div class="item-plugin-link"><a href="%s">%s</a></div>', $file, $view_words[ rand(0, count($view_words) - 1) ]);
						echo sprintf('</div>');
					}
				}
				catch (Exception $e) 
				{
					$message = $e->getMessage();
					pr($message);
				}

			?>
		</div>
		<div class="clear"></div>
	</div>
</body>
</html>