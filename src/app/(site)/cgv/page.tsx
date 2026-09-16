import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CGV / CGU',
  description:
    'Conditions générales de vente et d\'utilisation de l\'entreprise Oli\'Wood : commande, devis, paiements, délais, réception, garanties.',
  alternates: { canonical: '/cgv' },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontFamily: "'Khand', sans-serif",
        fontWeight: 700, fontSize: '20px',
        textTransform: 'uppercase', letterSpacing: '2px',
        color: 'var(--brun)', marginBottom: '12px',
        borderBottom: '2px solid var(--jaune)', paddingBottom: '6px',
        display: 'inline-block',
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: "'Khand', sans-serif",
        fontSize: '17px', fontWeight: 300,
        color: 'var(--taupe)', lineHeight: 1.7,
      }}>
        {children}
      </div>
    </div>
  )
}

export default function CgvPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="wrap" style={{ maxWidth: 800 }}>

        <span style={{
          fontFamily: "'Khand', sans-serif", fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '3px', fontSize: '14px',
          color: 'var(--jaune)', marginBottom: '16px', display: 'block',
        }}>
          Informations légales
        </span>

        <h1 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(34px, 5vw, 58px)',
          color: 'var(--jaune)', lineHeight: 1.1, marginBottom: '16px',
        }}>
          Conditions générales de vente et d&apos;utilisation
        </h1>

        <p style={{
          fontFamily: "'Khand', sans-serif", fontSize: '16px', fontWeight: 300,
          color: 'rgba(216,207,200,.8)', marginBottom: '40px',
        }}>
          Entreprise Oli&apos;Wood — version du 25 août 2026.
        </p>

        {/* Card crème */}
        <div style={{
          background: 'var(--creme)', borderRadius: '16px',
          padding: 'clamp(28px, 5vw, 52px)',
          boxShadow: '0 12px 40px rgba(0,0,0,.18)',
        }}>

          <Section title="Dispositions générales">
            <p>
              Toute commande de travaux implique de la part du client l&apos;acceptation sans réserve des
              conditions ci-dessous, en dépit de leurs propres conditions générales d&apos;achat.
            </p>
          </Section>

          <Section title="Conditions de vente">
            <p>
              Les conditions de paiement indiquées sur le devis prévalent sur les conditions de paiement
              indiquées dans les présentes conditions générales. La commande ne sera validée qu&apos;à
              réception de l&apos;acompte indiqué sur le devis.
            </p>
            <p style={{ marginTop: '12px' }}>
              La constitution du dossier d&apos;autorisation de construire est de la responsabilité du client.
              Le client s&apos;engage à obtenir toutes autorisations, permis, d&apos;origine administrative, avant
              le montage du bâtiment. En cas d&apos;absence d&apos;autorisation de construire, l&apos;entreprise
              OLI&apos;WOOD refusera de monter la construction.
            </p>
            <p style={{ marginTop: '12px' }}>
              Sauf indication contraire, nos bâtiments sont montés sur une maçonnerie préparée soit par le
              client, soit par nos soins si cela est stipulé sur le devis. La livraison et le montage sont
              prévus dans le délai estimé sur le devis mais ne sont effectués qu&apos;après confirmation du
              client nous avertissant que :
            </p>
            <ul style={{ margin: '8px 0 0 20px', listStyle: 'disc' }}>
              <li>le permis de construire est accordé et qu&apos;il nous en fait parvenir une copie de l&apos;attestation de l&apos;urbanisme ;</li>
              <li>les travaux de préparation de sol et d&apos;implantation sont terminés ;</li>
              <li>
                la livraison se fait dans un lieu accessible. Toute modification d&apos;accès au lieu de la
                construction doit être signalée au moment de la commande (= signature du devis).
              </li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              En cas de réalisation de la maçonnerie par vos soins, un délai supplémentaire de 8 semaines
              pourra être appliqué. En cas de glissement de votre part, nous ne pourrons plus être tenus
              pour responsables en cas de dépassement des délais initialement prévus. Les délais de
              livraison et de pose sont donnés à titre indicatif et les retards éventuels ne donnent pas le
              droit au client d&apos;annuler la vente, de refuser la marchandise ou de réclamer des dommages
              et intérêts.
            </p>
            <p style={{ marginTop: '12px' }}>
              Le client a la faculté de renoncer à la commande par lettre recommandée avec accusé de
              réception, dans les 14 jours (jours fériés compris) à compter de la date de signature de la
              commande. L&apos;acompte sera alors remboursé intégralement. Aucune annulation ne pourra être
              acceptée, passé ce délai de 14 jours de rétractation.
            </p>
            <p style={{ marginTop: '12px' }}>
              Lors de la signature de la commande, le client garantit avoir la pleine capacité juridique
              pour adhérer aux présentes conditions générales et ainsi conclure le présent contrat. Le
              client garantit qu&apos;il est pleinement habilité à utiliser le mode de règlement choisi et que
              celui-ci donne accès à des fonds suffisants pour couvrir tous les coûts nécessaires au
              règlement de la commande.
            </p>
          </Section>

          <Section title="Validité – devis">
            <p>
              Notre devis a une durée de validité clairement spécifiée sur celui-ci et s&apos;entend à partir
              de la date de création du devis. Toute commande passée après ce délai pourra entraîner une
              révision du prix. La signature du devis engage le client de façon ferme et définitive.
              L&apos;acceptation du devis implique également l&apos;acceptation dans leur intégralité des
              conditions générales de vente et d&apos;utilisation.
            </p>
            <p style={{ marginTop: '12px' }}>
              Tous travaux non prévus explicitement dans le devis seront considérés comme des travaux
              supplémentaires. Nous présenterons un devis complémentaire au client et nous requerrons son
              acceptation avant leur exécution. Toute modification de commande demandée par le client après
              signature du devis ne peut être prise en considération que si elle est parvenue par écrit
              et/ou faisant l&apos;objet d&apos;un avenant au devis existant ou à l&apos;établissement d&apos;un nouveau
              devis pour les prestations complémentaires / supplémentaires avant l&apos;approvisionnement des
              matières premières destinées à la fabrication des structures commandées.
            </p>
            <p style={{ marginTop: '12px' }}>
              Les prix s&apos;entendent TTC aux conditions économiques et fiscales en vigueur au jour de la
              signature et peuvent être révisables à l&apos;obtention du permis de construire en cas notamment
              de fluctuations importantes des prix des matières premières.
            </p>
            <p style={{ marginTop: '12px' }}>
              Pour être valables, les devis seront dûment signés et datés par le client, avec la mention
              « bon pour accord ».
            </p>
          </Section>

          <Section title="Taux de TVA">
            <p>
              Le taux de TVA applicable à nos prix est celui en vigueur à la date du devis ou de l&apos;offre.
              En cas de modification de la loi n°99-1172 du 30 décembre 1999 et/ou de ses décrets
              d&apos;application et/ou des instructions prises pour son application, toute variation ultérieure
              de ce taux sera répercutée sur ces prix.
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L&apos;entreprise conserve intégralement la propriété intellectuelle de ses études, devis,
              dessins, plans, maquettes, descriptifs, qui ne peuvent être communiqués, ni reproduits, ni
              exécutés sans son autorisation écrite, sous réserve de dommages et intérêts. Ils doivent être
              rendus s&apos;ils ne sont pas suivis d&apos;une commande.
            </p>
          </Section>

          <Section title="Délais">
            <p>
              Les délais de livraison ne sont donnés qu&apos;à titre indicatif. Notre responsabilité ne pourra
              pas être engagée dans les cas suivants :
            </p>
            <ul style={{ margin: '8px 0 0 20px', listStyle: 'disc' }}>
              <li>conditions de paiement non respectées par le client,</li>
              <li>modification dans le programme des travaux,</li>
              <li>retard des autres corps de métiers,</li>
              <li>travaux supplémentaires,</li>
              <li>lieux à aménager non disponibles à la date prévue,</li>
              <li>cause imputable à nos fournisseurs : grève, rupture de stock…</li>
              <li>cas de force majeure ou d&apos;évènements tels que : grève de l&apos;entreprise, incendie, intempéries…</li>
            </ul>
          </Section>

          <Section title="Conditions d'exécution – travaux d'ossature bois">
            <p>
              Le début de nos travaux s&apos;effectuera en fonction de notre planning, en accord avec le délai
              annoncé à notre client et en fonction des intempéries. La pose de nos ouvrages ne pourra
              s&apos;effectuer que sur un site accessible, après achèvement des emplacements réservés à cet
              effet et maçonnerie.
            </p>
          </Section>

          <Section title="Paiements">
            <p>
              Le solde de la facture sera réglé à réception de l&apos;ouvrage constaté par un procès-verbal de
              réception signé du client ou de son représentant muni de son pouvoir. Le client accepte ne pas
              recourir à une demande de réserve de garantie et de régler à vue toutes factures justifiées
              par un avis de réception signé de son représentant. Les factures seront réglées au comptant à
              l&apos;entreprise par chèque ou virement dès réception.
            </p>
            <p style={{ marginTop: '12px' }}>
              Dans le cas d&apos;un paiement anticipé en référence aux délais prévus sur le devis validé par le
              client, aucun escompte ne sera accordé.
            </p>
            <p style={{ marginTop: '12px' }}>
              Tout défaut de paiement à son échéance entraînera en outre l&apos;exigibilité d&apos;une indemnité de
              15 % de la somme impayée à titre de dommages-intérêts et l&apos;application d&apos;intérêts de retard
              calculés sur les sommes exigibles au taux légal multiplié par trois, conformément à l&apos;article
              L 441-6 du code du commerce. En cas d&apos;intervention d&apos;un service « recouvrement contentieux »
              en vue de paiement, il sera perçu en sus du principal et toutes autres sommes exigibles, des
              frais de recouvrement évalués à 15 % du montant du principal, demeuré impayé.
            </p>
          </Section>

          <Section title="Suspension des travaux">
            <p>
              En cas de non-observation des conditions de paiements, nous nous réservons le droit de
              suspendre les travaux jusqu&apos;à régularisation des dettes, après mise en demeure préalable
              adressée au client étant restée infructueuse.
            </p>
          </Section>

          <Section title="Rupture du contrat">
            <p>
              En cas de rupture du contrat imputable au client, avant la réalisation des travaux commandés,
              l&apos;acompte versé à la commande sera conservé à titre d&apos;indemnisation forfaitaire. À cette
              somme s&apos;ajoutera le montant des fournitures et du matériel déjà commandé.
            </p>
            <p style={{ marginTop: '12px' }}>
              En cas de rupture du contrat en cours de réalisation des travaux, s&apos;ajoutera à la facturation
              des travaux réalisés une somme forfaitaire égale à 15 % du montant TTC du devis ou de la
              commande.
            </p>
          </Section>

          <Section title="Réserve de propriété">
            <p>
              La marchandise livrée reste la propriété de l&apos;entreprise jusqu&apos;au paiement intégral du prix
              par le client (loi n°80.335 du 30.5.1980). Néanmoins, la charge du risque de toute nature est
              transférée au client dès la livraison. Dans le cas où le paiement n&apos;interviendrait pas dans
              le délai imparti, nous nous réservons le droit de reprendre la marchandise, et le cas échéant,
              de dissoudre le contrat sans indemnités d&apos;aucune sorte.
            </p>
          </Section>

          <Section title="Réception">
            <p>
              Dès l&apos;achèvement de la construction et avant toute occupation, le client procédera en
              présence de l&apos;entreprise à la réception du bâtiment, dans un délai maximal de 7 jours.
              L&apos;occupation, même partielle de la construction par le client vaut réception sans réserve. À
              défaut, la mise en œuvre est considérée comme acceptée sans réserve dans les 10 jours ouvrés
              suivant son achèvement.
            </p>
            <p style={{ marginTop: '12px' }}>
              Toute réclamation devra alors s&apos;effectuer par lettre recommandée avec accusé de réception.
            </p>
            <p style={{ marginTop: '12px' }}>
              Aucune réclamation ne pourra être présentée après la transformation ou la mise en œuvre si les
              règles de l&apos;art, notamment les normes NF-DTU, n&apos;ont pas été respectées.
            </p>
          </Section>

          <Section title="Attribution de compétence">
            <p>
              En cas de contestation, il est fait attribution de compétence aux tribunaux du siège social de
              l&apos;entreprise.
            </p>
          </Section>

          <Section title="Entretien">
            <p>
              Les éléments de bois, non déjà traités ou peints par nos soins, doivent être lasurés ou
              protégés par vos soins avec un produit adapté dans les deux mois suivants la livraison. Les
              bâtiments en bois, même traités, requièrent un entretien régulier. L&apos;entreprise ne saurait
              être responsable d&apos;une dégradation de la construction due à un manque d&apos;entretien. La
              finition, si non vendue, et l&apos;entretien sont à la charge du client. Des dégradations sur la
              lasure avec le temps ne rentrent pas dans la garantie de décennale.
            </p>
            <p style={{ marginTop: '12px' }}>
              Le bois est issu d&apos;une matière vivante, par conséquent le client doit tolérer les risques de
              déformation et de gerce qui peuvent survenir après la mise en œuvre.
            </p>
            <p style={{ marginTop: '12px' }}>
              Le client en choisissant une structure en bois, en accepte les singularités que ce produit
              biologique peut présenter à savoir : les nœuds, les variations de couleurs, les veines, les
              fentes, les gerces ou tout autre « défaut » que le bois est susceptible de comporter, ainsi
              que du rejet de la sève (coulure ou perle du bois).
            </p>
            <p style={{ marginTop: '12px' }}>
              Les marchandises sont fournies avec les tolérances d&apos;usage, en section, épaisseurs, longueur,
              qualité. Tous les bois sont mesurés avant fabrication, de ce fait, un écart de mesure dû au
              retrait du séchage est possible avant / après la mise en œuvre.
            </p>
          </Section>

          <Section title="Assurance">
            <p>
              Nous conseillons fortement à nos clients d&apos;assurer la structure en ossature bois acquise dès
              réception des travaux auprès de leur assurance habitation habituelle.
            </p>
            <p style={{ marginTop: '12px' }}>
              La garantie décennale de l&apos;entreprise ne s&apos;appliquera qu&apos;en cas de défaillance du produit.
              En aucun cas, elle ne jouera en cas d&apos;accident, de chocs, volontaires ou non, de modification
              d&apos;installation ou d&apos;intervention ayant amené le démontage du bâtiment. La garantie décennale
              n&apos;intervient que sur les dommages portant atteinte à la solidité de l&apos;ouvrage ou qui le
              rendent impropre à destination.
            </p>
          </Section>

          <Section title="Contestation">
            <p>
              En cas de litiges, art. L111-1 et L616-1 du code de la consommation, vous pouvez dans un
              premier temps faire appel à la médiation de la consommation – voir le paragraphe
              réclamation-médiation à la fin de votre devis – avant de saisir éventuellement la justice.
            </p>
          </Section>

        </div>
      </div>
    </div>
  )
}
